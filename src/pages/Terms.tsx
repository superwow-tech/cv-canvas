import SiteLayout from "@/components/SiteLayout";
import { product } from "@/lib/plans";

export default function Terms() {
  return (
    <SiteLayout>
      <article className="w-full max-w-3xl mx-auto px-5 sm:px-8 md:px-12 py-14 font-['Rubik']">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">Terms of Service</h1>
        <p className="mt-4 text-sm text-foreground/55">Last updated: August 2026</p>

        <div className="mt-10 space-y-8 text-sm md:text-base leading-relaxed text-foreground/75">
          <section>
            <h2 className="text-lg font-medium text-foreground">1. The service</h2>
            <p className="mt-2">
              {product.name} is a web tool that helps you write resumes and export them as PDF files. You may use it for
              your own job applications and for resumes you are authorised to prepare.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">2. Your account</h2>
            <p className="mt-2">
              You are responsible for keeping your login details safe and for the accuracy of the content you enter. You
              may delete your resumes or stop using the service at any time.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">3. Plans and billing</h2>
            <p className="mt-2">
              The Free plan is available at no cost. Pro is billed monthly in advance and renews until cancelled. You can
              cancel at any time and keep Pro access until the end of the paid period. Fees already paid are
              non-refundable except where required by law.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">4. Acceptable use</h2>
            <p className="mt-2">
              Do not use the service to impersonate other people, to submit unlawful content, or to attempt to disrupt or
              reverse-engineer the platform.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">5. Availability and liability</h2>
            <p className="mt-2">
              The service is provided as is. We work to keep it available but cannot guarantee uninterrupted access, and
              we are not liable for hiring outcomes or indirect losses.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-foreground">6. Contact</h2>
            <p className="mt-2">Questions about these terms can be sent to the address listed on our contact page.</p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}
