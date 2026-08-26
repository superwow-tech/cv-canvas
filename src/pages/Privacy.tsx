import SiteLayout from "@/components/SiteLayout";
import { product } from "@/lib/plans";

export default function Privacy() {
  return (
    <SiteLayout>
      <article className="w-full max-w-3xl mx-auto px-5 sm:px-8 md:px-12 py-14 font-['Rubik']">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">Privacy Policy</h1>
        <p className="mt-4 text-sm text-foreground/55">Last updated: August 2026</p>

        <div className="mt-10 space-y-8 text-sm md:text-base leading-relaxed text-foreground/75">
          <section>
            <h2 className="text-lg font-medium text-foreground">What we store</h2>
            <p className="mt-2">
              {product.name} stores your email address, the resumes you create, and your subscription status. Resume
              content is only visible to your own account.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">Why we store it</h2>
            <p className="mt-2">
              To sign you in, to save your work between sessions, to generate your PDF exports, and to apply the limits of
              your plan.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">PDF generation</h2>
            <p className="mt-2">
              PDFs are generated in your browser. The finished file is not uploaded or stored on our servers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">Processors</h2>
            <p className="mt-2">
              We use a managed database and authentication provider to host your account data, and a payment provider to
              process Pro subscriptions. Card details never reach our servers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">Your choices</h2>
            <p className="mt-2">
              You can edit or delete any resume from your dashboard, and you can request deletion of your account and all
              associated data.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}
