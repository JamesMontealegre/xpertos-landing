import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Xpertos recolecta, usa y protege los datos personales de clientes y expertos, conforme a la Ley 1581 de 2012.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" updatedAt="9 de octubre de 2026">
      <p>
        Esta política describe cómo Xpertos trata los datos personales de
        clientes, expertos y aspirantes, en cumplimiento de la Ley 1581 de 2012,
        el Decreto 1377 de 2013 y demás normas aplicables en Colombia.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Xpertos (datos de identificación y domicilio pendientes de
        confirmación). Contacto:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <h2>2. Datos que recolectamos</h2>
      <ul>
        <li>
          <strong>Clientes:</strong> nombre, correo, teléfono, ciudad, dirección
          del servicio, fotos del requerimiento y comprobantes de pago.
        </li>
        <li>
          <strong>Aspirantes y expertos:</strong> nombre, correo, teléfono,
          ciudad, categorías, años de experiencia, reseña profesional y
          documentos de verificación (cédula, planilla de seguridad social y
          ARL, foto, carta de recomendación y, de forma opcional, RUT,
          antecedentes, certificados y portafolio).
        </li>
        <li>
          <strong>Datos del servicio:</strong> estados, cotizaciones, pagos, contratos y
          firmas electrónicas (incluidos fecha, dirección IP y navegador usados
          al firmar), calificaciones y comentarios.
        </li>
      </ul>

      <h2>3. Para qué usamos los datos</h2>
      <ul>
        <li>Verificar la identidad e idoneidad de los expertos.</li>
        <li>Asignar servicios, coordinar su ejecución y administrar el pago del cliente y el pago a los expertos.</li>
        <li>Generar y conservar los contratos digitales y su evidencia de firma.</li>
        <li>Atender solicitudes, quejas y reclamos.</li>
        <li>Enviar comunicaciones relacionadas con el servicio.</li>
      </ul>

      <h2>4. Con quién compartimos los datos</h2>
      <p>
        Compartimos únicamente los datos necesarios entre cliente y experto
        para prestar el servicio (por ejemplo, nombre, teléfono y dirección).
        Usamos proveedores de infraestructura en la nube para almacenar la
        información, bajo medidas de seguridad y acuerdos de confidencialidad.
        No vendemos datos personales.
      </p>

      <h2>5. Conservación y seguridad</h2>
      <p>
        Conservamos los datos mientras la cuenta esté activa y durante los
        plazos legales aplicables para contratos y pagos. Los documentos de
        verificación se almacenan en repositorios privados con acceso
        restringido al equipo de operación.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes conocer, actualizar, rectificar y solicitar la supresión de tus
        datos, así como revocar la autorización, escribiendo a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        . Responderemos en los plazos previstos por la ley.
      </p>

      <h2>7. Autorización</h2>
      <p>
        Al diligenciar el formulario “Trabaja con nosotros” o registrarte en la
        app, autorizas de manera previa, expresa e informada el tratamiento de
        tus datos para las finalidades descritas en esta política.
      </p>
    </LegalPage>
  );
}
