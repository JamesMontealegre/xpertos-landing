"use client";

import { useActionState, useId, useState, type FormEvent } from "react";
import type { Category } from "@/lib/categories";
import { USERS_APP_URL } from "@/lib/site";
import {
  submitExpertApplication,
  type ApplyFormValues,
  type ApplyState,
} from "@/app/actions/apply";
import { Button, ButtonLink } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { APPLY_FIELDS, applyFieldError, cleanPhoneInput, type ApplyField } from "@/lib/validation";

const EMPTY_VALUES: ApplyFormValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  categories: [],
  experienceYears: "",
  bio: "",
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
    city: str("city"),
    categories: data.getAll("categories").filter((v): v is string => typeof v === "string"),
    experienceYears: str("experienceYears"),
    bio: str("bio"),
    acceptTerms: data.get("acceptTerms") === "on",
  };
}

const isApplyField = (name: string): name is ApplyField => (APPLY_FIELDS as string[]).includes(name);

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-red-500";

export function ExpertApplicationForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(
    submitExpertApplication,
    INITIAL_STATE,
  );
  const formId = useId();
  // Validación en el navegador (mismas reglas que el servidor): cada campo se revisa al salir de él,
  // se vuelve a revisar mientras se corrige y todo se revisa al enviar. null = el campo está bien.
  const [clientErrors, setClientErrors] = useState<Partial<Record<ApplyField, string | null>>>({});

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

  const validateField = (form: HTMLFormElement, field: ApplyField) =>
    setClientErrors((current) => ({ ...current, [field]: applyFieldError(field, readForm(form)) }));

  const onBlur = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    // Las casillas se revisan al marcarlas (onChange); los campos de texto al salir.
    if (target.type !== "checkbox" && isApplyField(target.name)) validateField(event.currentTarget, target.name);
  };

  const onChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (!isApplyField(target.name)) return;
    if (target.name === "phone") {
      const clean = cleanPhoneInput(target.value);
      if (clean !== target.value) target.value = clean;
    }
    if (target.type === "checkbox" || clientErrors[target.name]) validateField(event.currentTarget, target.name);
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
      className="space-y-5"
      aria-busy={pending}
    >
      {hasClientErrors || state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {hasClientErrors ? "Revisa los campos marcados en rojo." : state.status === "error" ? state.message : null}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-fullName`}
          label="Nombre completo"
          error={errorFor("fullName")}
          errorId={errorId("fullName")}
        >
          <input
            id={`${formId}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre y apellido"
            defaultValue={values.fullName}
            aria-invalid={Boolean(errorFor("fullName"))}
            aria-describedby={errorFor("fullName") ? errorId("fullName") : undefined}
            className={inputClass}
          />
        </Field>
        <Field
          id={`${formId}-email`}
          label="Correo electrónico"
          error={errorFor("email")}
          errorId={errorId("email")}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="nombre@correo.com"
            defaultValue={values.email}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={errorFor("email") ? errorId("email") : undefined}
            className={inputClass}
          />
        </Field>
        <Field
          id={`${formId}-phone`}
          label="Celular / WhatsApp"
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
            aria-describedby={errorFor("phone") ? errorId("phone") : undefined}
            className={inputClass}
          />
        </Field>
        <Field
          id={`${formId}-city`}
          label="Ciudad"
          error={errorFor("city")}
          errorId={errorId("city")}
        >
          <input
            id={`${formId}-city`}
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            placeholder="Bogotá, Medellín…"
            defaultValue={values.city}
            aria-invalid={Boolean(errorFor("city"))}
            aria-describedby={errorFor("city") ? errorId("city") : undefined}
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset
        aria-describedby={errorFor("categories") ? errorId("categories") : undefined}
        aria-invalid={Boolean(errorFor("categories"))}
      >
        <legend className="text-sm font-medium text-ink">
          ¿En qué categorías trabajas?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {categories.map((category) => {
            const id = `${formId}-cat-${category.slug}`;
            return (
              <label
                key={category.id}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40"
              >
                <input
                  id={id}
                  type="checkbox"
                  name="categories"
                  value={category.id}
                  defaultChecked={values.categories.includes(category.id)}
                  className="h-4 w-4 rounded border-line text-primary accent-primary focus:ring-primary"
                />
                {category.name}
              </label>
            );
          })}
        </div>
        <FieldError id={errorId("categories")} message={errorFor("categories")} />
      </fieldset>

      <Field
        id={`${formId}-experienceYears`}
        label="Años de experiencia"
        error={errorFor("experienceYears")}
        errorId={errorId("experienceYears")}
      >
        <input
          id={`${formId}-experienceYears`}
          name="experienceYears"
          type="number"
          inputMode="numeric"
          min={0}
          max={60}
          step={1}
          required
          defaultValue={values.experienceYears}
          aria-invalid={Boolean(errorFor("experienceYears"))}
          aria-describedby={
            errorFor("experienceYears") ? errorId("experienceYears") : undefined
          }
          className={`${inputClass} sm:max-w-xs`}
        />
      </Field>

      <Field
        id={`${formId}-bio`}
        label="Reseña corta de tu experiencia"
        hint="Qué tipo de trabajos haces, dónde has trabajado y qué te diferencia."
        error={errorFor("bio")}
        errorId={errorId("bio")}
      >
        <textarea
          id={`${formId}-bio`}
          name="bio"
          rows={4}
          required
          minLength={20}
          maxLength={1000}
          defaultValue={values.bio}
          aria-invalid={Boolean(errorFor("bio"))}
          aria-describedby={errorFor("bio") ? errorId("bio") : undefined}
          className={inputClass}
        />
      </Field>

      <div>
        <label
          htmlFor={`${formId}-acceptTerms`}
          className="flex items-start gap-3 text-sm text-slate-700"
        >
          <input
            id={`${formId}-acceptTerms`}
            name="acceptTerms"
            type="checkbox"
            required
            defaultChecked={values.acceptTerms}
            aria-invalid={Boolean(errorFor("acceptTerms"))}
            aria-describedby={errorFor("acceptTerms") ? errorId("acceptTerms") : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-primary focus:ring-primary"
          />
          <span>
            Acepto los{" "}
            <a href="/terminos" className="font-medium text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener">
              términos y condiciones
            </a>{" "}
            y el{" "}
            <a href="/privacidad" className="font-medium text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener">
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

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Enviar postulación"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  errorId,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      {children}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-700">
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
