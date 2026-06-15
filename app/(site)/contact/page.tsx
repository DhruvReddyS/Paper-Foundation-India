import ContactForm from "./sections/ContactForm";
import ContactInfo from "./sections/ContactInfo";
import ContactSuccess from "./sections/ContactSuccess";

export const metadata = {
  title: "Contact | Paper Foundation India",
  description: "Get in touch with Paper Foundation India for inquiries, partnerships, or media requests.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactForm />
      <ContactInfo />
      {/* ContactSuccess is shown conditionally after form submit — rendered here as demo */}
      <ContactSuccess />
    </main>
  );
}
