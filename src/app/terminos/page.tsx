import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso de la plataforma Xpertos para clientes y expertos independientes.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones" updatedAt="7 de octubre de 2026">
      <p>
        Estos términos regulan el uso de la plataforma Xpertos (en adelante,
        “Xpertos” o “la plataforma”) por parte de clientes que solicitan
        servicios y de expertos independientes que los prestan. Al usar la
        plataforma aceptas estos términos.
      </p>

      <h2>1. Qué es Xpertos</h2>
      <p>
        Xpertos presta servicios para el hogar y la obra por medio de una red
        de expertos independientes verificados. Xpertos verifica la identidad y
        documentos de los expertos, asigna cada servicio a un experto de su red,
        recibe el pago del cliente y celebra con él el contrato del servicio. El
        experto asignado ejecuta el trabajo en nombre de Xpertos.
      </p>

      <h2>2. Expertos independientes</h2>
      <p>
        Los expertos son profesionales independientes. No existe relación
        laboral, de subordinación ni de exclusividad entre Xpertos y los
        expertos: cada experto define su disponibilidad, acepta o rechaza
        servicios y responde por sus obligaciones tributarias y de seguridad
        social como trabajador independiente. Para mantenerse activo, el
        experto debe acreditar afiliación vigente al sistema de seguridad
        social.
      </p>

      <h2>3. Contrato entre el cliente y Xpertos</h2>
      <p>
        Cada servicio se formaliza mediante un contrato de prestación de
        servicios entre el cliente y Xpertos. El experto asignado no es parte
        del contrato: Xpertos responde ante el cliente por el trabajo. Xpertos
        emite el contrato y el cliente lo firma electrónicamente dentro de la app.
        Conforme a la Ley 527 de 1999 y el Decreto 2364 de 2012, la firma
        electrónica y los mensajes de datos tienen validez y fuerza probatoria.
      </p>

      <h2>4. Precio, etapas y pagos</h2>
      <ul>
        <li>El precio se acuerda por etapas antes de iniciar el servicio.</li>
        <li>
          El cliente paga cada etapa a través de los medios indicados por
          Xpertos y adjunta el comprobante; Xpertos verifica el pago.
        </li>
        <li>
          Xpertos cobra una comisión por servicio, incluida en el precio
          acordado, que se descuenta antes de girar al experto.
        </li>
        <li>No se deben realizar pagos directos entre cliente y experto.</li>
      </ul>

      <h2>5. Garantía y resolución de problemas</h2>
      <p>
        Xpertos acompaña el servicio y media entre las partes ante cualquier
        inconveniente. El alcance de la garantía al cliente (por ejemplo,
        re-ejecución del trabajo o reembolso de etapas no ejecutadas) se
        definirá en la versión final de estos términos.
      </p>

      <h2>6. Cancelaciones</h2>
      <p>
        El cliente puede cancelar sin costo mientras el servicio no haya sido
        asignado. Después de la asignación, las cancelaciones se gestionan con
        el operador de Xpertos y pueden implicar el cobro de etapas ejecutadas.
      </p>

      <h2>7. Uso adecuado de la plataforma</h2>
      <p>
        Está prohibido suministrar información falsa, suplantar a terceros,
        usar la plataforma para fines ilegales o intentar evadir el pago a
        través de Xpertos. El incumplimiento puede implicar la suspensión de la
        cuenta.
      </p>

      <h2>8. Cambios y contacto</h2>
      <p>
        Xpertos puede actualizar estos términos; la versión vigente estará
        siempre publicada en este sitio. Para dudas escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </LegalPage>
  );
}
