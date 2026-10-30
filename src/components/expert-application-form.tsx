"use client";

import { useActionState, useId, useState, type FormEvent, type ReactNode } from "react";
import type { Occupation } from "@/lib/occupations";
import { DEPARTMENTS, MUNICIPALITIES } from "@/lib/divipola";
import { USERS_APP_URL } from "@/lib/site";
import {
  submitExpertApplication,
  type ApplyFormValues,
  type ApplyState,
} from "@/app/actions/apply";
import { Button, ButtonLink } from "@/components/ui";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { APPLY_FIELDS, applyFieldError, cleanPhoneInput, type ApplyField } from "@/lib/validation";

// Valle del Cauca viene elegido: ahí arranca Xpertos.
const EMPTY_VALUES: ApplyFormValues = {
  fullName: "",
  email: "",
  phone: "",
  department: "76",
  municipality: "",
  occupation: [],
  acceptTerms: false,
};

const INITIAL_STATE: ApplyState = { status: "idle" };

function readForm(form: HTMLFormElement): ApplyFormValues {
  const data = new FormData(form);
  const str = (key: string) => {
    const v = data.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    department: str("department"),
    municipality: str("municipality"),
    occupation: data.getAll("occupation").filter((v): v is string => typeof v === "string" && v !== ""),
    acceptTerms: data.get("acceptTerms") === "on",
  };
}

const isApplyField = (name: string): name is ApplyField => (APPLY_FIELDS as string[]).includes(name);

// Letra de 18 px y campos de 56 px de alto: cómodos para leer y tocar a cualquier edad.
const inputClass =
  "mt-2 block min-h-14 w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-lg text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 aria-[invalid=true]:border-red-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export function ExpertApplicationForm({ occupations }: { occupations: Occupation[] }) {
  const [state, formAction, pending] = useActionState(
    submitExpertApplication,
    INITIAL_STATE,
  );
  const formId = useId();
  // Validación en el navegador (mismas reglas que el servidor): cada campo se revisa al salir de él,
  // se vuelve a revisar mientras se corrige y todo se revisa al enviar. null = el campo está bien.
  const [clientErrors, setClientErrors] = useState<Partial<Record<ApplyField, string | null>>>({});
  // El departamento elegido decide qué municipios se listan.
  const [department, setDepartment] = useState(() =>
    state.status === "error" ? state.values.department : EMPTY_VALUES.department,
  );

  if (state.status === "success") {
    return <SuccessMessage email={state.email} fullName={state.fullName} accountCreated={state.accountCreated} />;
  }

  if (state.status === "duplicate") {
    return <DuplicateMessage email={state.email} message={state.message} />;
  }

  const values = state.status === "error" ? state.values : EMPTY_VALUES;
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errorId = (field: keyof ApplyFormValues) => `${formId}-${field}-error`;
  const errorFor = (field: ApplyField): string | undefined =>
    field in clientErrors ? (clientErrors[field] ?? undefined) : errors[field]?.[0];
  const describedBy = (field: ApplyField, hintId?: string) =>
    [hintId, errorFor(field) ? errorId(field) : null].filter(Boolean).join(" ") || undefined;
  const municipalities = MUNICIPALITIES[department] ?? [];

  const validateField = (form: HTMLFormElement, field: ApplyField) =>
    setClientErrors((current) => ({ ...current, [field]: applyFieldError(field, readForm(form)) }));

  const onBlur = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    // Las casillas y las listas se revisan al cambiarlas (onChange); los campos de texto al salir.
    if (target.type !== "checkbox" && target.tagName !== "SELECT" && isApplyField(target.name)) {
      validateField(event.currentTarget, target.name);
    }
  };

  const onChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (!isApplyField(target.name)) return;
    if (target.name === "phone") {
      const clean = cleanPhoneInput(target.value);
      if (clean !== target.value) target.value = clean;
    }
    if (target.name === "department") {
      // Otro departamento: la lista de municipios empieza de nuevo, sin error hasta que se envíe.
      setDepartment(target.value);
      setClientErrors((current) => ({ ...current, department: null, municipality: null }));
      return;
    }
    if (target.type === "checkbox" || target.tagName === "SELECT" || clientErrors[target.name]) {
      validateField(event.currentTarget, target.name);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const values = readForm(event.currentTarget);
    const found = Object.fromEntries(APPLY_FIELDS.map((f) => [f, applyFieldError(f, values)])) as Record<ApplyField, string | null>;
    const firstInvalid = APPLY_FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      event.preventDefault();
      setClientErrors(found);
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    // Todo bien: se limpian para que se vean los errores que pueda devolver el servidor.
    setClientErrors({});
  };
  const hasClientErrors = Object.values(clientErrors).some(Boolean);

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={onSubmit}
      onBlur={onBlur}
      onChange={onChange}
      className="space-y-6"
      aria-busy={pending}
    >
      <div>
        <h3 className="text-2xl font-bold text-ink">Postúlate en un minuto</h3>
        <p className="mt-1 text-base text-slate-600">Solo te pedimos estos datos. Los documentos los subes después en la app.</p>
      </div>

      {hasClientErrors || state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-base text-red-800"
        >
          {hasClientErrors ? "Revisa los campos marcados en rojo." : state.status === "error" ? state.message : null}
        </p>
      ) : null}

      <Field id={`${formId}-fullName`} label="Nombre completo" error={errorFor("fullName")} errorId={errorId("fullName")}>
        <input
          id={`${formId}-fullName`}
          name="fullName"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          required
          placeholder="Nombre y apellido"
          defaultValue={values.fullName}
          aria-invalid={Boolean(errorFor("fullName"))}
          aria-describedby={describedBy("fullName")}
          className={inputClass}
        />
      </Field>

      <Field
        id={`${formId}-phone`}
        label="Celular"
        hint="Te escribiremos por WhatsApp."
        hintId={`${formId}-phone-hint`}
        error={errorFor("phone")}
        errorId={errorId("phone")}
      >
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          maxLength={16}
          placeholder="300 123 4567"
          defaultValue={values.phone}
          aria-invalid={Boolean(errorFor("phone"))}
          aria-describedby={describedBy("phone", `${formId}-phone-hint`)}
          className={inputClass}
        />
      </Field>

      <Field
        id={`${formId}-email`}
        label="Correo electrónico"
        hint="Ahí te llega la clave para entrar a la app."
        hintId={`${formId}-email-hint`}
        error={errorFor("email")}
        errorId={errorId("email")}
      >
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          required
          placeholder="nombre@correo.com"
          defaultValue={values.email}
          aria-invalid={Boolean(errorFor("email"))}
          aria-describedby={describedBy("email", `${formId}-email-hint`)}
          className={inputClass}
        />
      </Field>

      <Field id={`${formId}-department`} label="Departamento" error={errorFor("department")} errorId={errorId("department")}>
        <Select
          id={`${formId}-department`}
          name="department"
          defaultValue={values.department}
          invalid={Boolean(errorFor("department"))}
          describedBy={describedBy("department")}
        >
          <option value="" disabled>
            Elige tu departamento
          </option>
          {DEPARTMENTS.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field id={`${formId}-municipality`} label="Municipio" error={errorFor("municipality")} errorId={errorId("municipality")}>
        <Select
          // Al cambiar de departamento la lista se arma de nuevo y queda sin elegir.
          key={department}
          id={`${formId}-municipality`}
          name="municipality"
          defaultValue={department === values.department ? values.municipality : ""}
          disabled={municipalities.length === 0}
          invalid={Boolean(errorFor("municipality"))}
          describedBy={describedBy("municipality")}
        >
          <option value="" disabled>
            {department ? "Elige tu municipio" : "Primero elige el departamento"}
          </option>
          {municipalities.map((m) => (
            <option key={m.code} value={m.code}>
              {m.name}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset aria-describedby={describedBy("occupation", `${formId}-occupation-hint`)}>
        <legend className="block text-base font-semibold text-ink">¿Cuál es tu ocupación?</legend>
        <p id={`${formId}-occupation-hint`} className="mt-0.5 text-base text-slate-500">
          Marca todas las que haces.
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {occupations.map((o) => (
            <label
              key={o.code}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 border-line px-4 py-2 text-base text-ink has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                name="occupation"
                type="checkbox"
                value={o.code}
                defaultChecked={values.occupation.includes(o.code)}
                aria-invalid={Boolean(errorFor("occupation"))}
                className="h-6 w-6 shrink-0 rounded border-line accent-primary focus:ring-primary"
              />
              <span>{o.name}</span>
            </label>
          ))}
        </div>
        <FieldError id={errorId("occupation")} message={errorFor("occupation")} />
      </fieldset>

      <div>
        <label
          htmlFor={`${formId}-acceptTerms`}
          className="flex cursor-pointer items-start gap-4 rounded-xl border-2 border-line p-4 text-base text-slate-700 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
        >
          <input
            id={`${formId}-acceptTerms`}
            name="acceptTerms"
            type="checkbox"
            required
            defaultChecked={values.acceptTerms}
            aria-invalid={Boolean(errorFor("acceptTerms"))}
            aria-describedby={describedBy("acceptTerms")}
            className="mt-0.5 h-6 w-6 shrink-0 rounded border-line accent-primary focus:ring-primary"
          />
          <span>
            Acepto los{" "}
            <a href="/terminos" className="font-semibold text-primary underline underline-offset-2" target="_blank" rel="noopener">
              términos y condiciones
            </a>{" "}
            y el{" "}
            <a href="/privacidad" className="font-semibold text-primary underline underline-offset-2" target="_blank" rel="noopener">
              tratamiento de mis datos personales
            </a>
            .
          </span>
        </label>
        <FieldError id={errorId("acceptTerms")} message={errorFor("acceptTerms")} />
      </div>

      {/* Honeypot anti-spam: oculto para personas, visible para bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Sitio web</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <Button type="submit" disabled={pending} className="min-h-14 w-full text-lg">
        {pending ? "Enviando…" : "Enviar postulación"}
      </Button>
    </form>
  );
}

/** Lista desplegable nativa (en el celular abre el selector del sistema, fácil de usar) con flecha visible. */
function Select({
  id,
  name,
  defaultValue,
  disabled,
  invalid,
  describedBy,
  children,
}: {
  id: string;
  name: string;
  defaultValue: string;
  disabled?: boolean;
  invalid: boolean;
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${inputClass} appearance-none pr-12`}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 mt-1 h-6 w-6 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  hintId,
  error,
  errorId,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-0.5 text-base text-slate-500">
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-base font-medium text-red-700">
      {message}
    </p>
  );
}

function NextSteps({ accountCreated = true }: { accountCreated?: boolean }) {
  return (
    <ol className="mt-5 space-y-3 text-left text-slate-700">
      <li className="flex gap-3">
        <StepNumber n={1} />
        <span>
          {accountCreated
            ? "Revisa tu correo: te enviamos tu clave temporal (mira también en spam o promociones)."
            : "Abre la app Xpertos con la cuenta que ya tienes."}
        </span>
      </li>
      <li className="flex gap-3">
        <StepNumber n={2} />
        <span>
          {accountCreated ? (
            <>
              Entra a la{" "}
              <a href={USERS_APP_URL} className="font-semibold text-primary underline-offset-2 hover:underline">
                app Xpertos
              </a>{" "}
              con tu correo y la clave temporal, y crea tu propia contraseña.
            </>
          ) : (
            <>
              Entra a la{" "}
              <a href={USERS_APP_URL} className="font-semibold text-primary underline-offset-2 hover:underline">
                app Xpertos
              </a>{" "}
              con tu correo y tu contraseña.
            </>
          )}
        </span>
      </li>
      <li className="flex gap-3">
        <StepNumber n={3} />
        <span>
          Sube tus documentos (cédula por ambos lados, planilla de seguridad
          social y ARL, foto 3x4 con fondo blanco y carta de recomendación de tu
          último trabajo) en la sección <strong>“Mi postulación”</strong>.
        </span>
      </li>
    </ol>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
      {n}
    </span>
  );
}

function SuccessMessage({ email, fullName, accountCreated }: { email: string; fullName: string; accountCreated: boolean }) {
  return (
    <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
        <CheckIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-ink">
        ¡Recibimos tu postulación{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
      </h3>
      <p className="mt-2 text-slate-700">
        {accountCreated ? (
          <>
            Te enviamos un correo a <strong>{email}</strong> con tu clave temporal para entrar a la app y completar tu
            postulación.
          </>
        ) : (
          <>
            La registramos con el correo <strong>{email}</strong>, que ya tiene cuenta en Xpertos.
          </>
        )}
      </p>
      <NextSteps accountCreated={accountCreated} />
      <p className="mt-5 rounded-lg border border-accent/40 bg-accent/10 p-3 text-left text-sm text-slate-800">
        <strong>Tienes 15 días calendario</strong> para completar tu postulación y subir todos los documentos. Si no la
        completas en ese plazo, se revocará automáticamente.
      </p>
      <ButtonLink href={USERS_APP_URL} className="mt-6 w-full sm:w-auto">
        Abrir la app Xpertos
      </ButtonLink>
    </div>
  );
}

function DuplicateMessage({ email, message }: { email: string; message: string }) {
  return (
    <div role="status" className="rounded-xl border border-accent/40 bg-orange-50 p-6">
      <h3 className="text-xl font-semibold text-ink">Ya te tenemos en la lista</h3>
      <p className="mt-2 text-slate-700">{message}</p>
      <p className="mt-1 text-sm text-slate-600">
        Correo: <strong>{email}</strong>
      </p>
      <NextSteps />
      <ButtonLink href={USERS_APP_URL} className="mt-6 w-full sm:w-auto">
        Abrir la app Xpertos
      </ButtonLink>
    </div>
  );
}
