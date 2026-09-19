# Contact delivery activation

Service: FormSubmit AJAX. Recipient: **ebitonda@andrew.cmu.edu**.

The single configuration value for delivery is the `action` of `#contact-form` in `index.html`: `https://formsubmit.co/ebitonda@andrew.cmu.edu`. JavaScript derives the AJAX endpoint and direct-email fallback from it. Static contact text elsewhere should also be updated if the professional email changes.

Each submission includes name, email, subject and message. `_subject` becomes `Portfolio Contact — [Visitor Subject]`; `_replyto` uses the validated visitor email. The service controls the sending identity; the form does not spoof From. The table template makes the supplied fields readable.

The form uses a honeypot, one in-flight request at a time, accessible validation/status messages, and a timeout. Messages are not stored in localStorage or logged. No credentials or secret keys are used. AJAX uses the provider's spam filtering without embedding an intrusive CAPTCHA; no extra `_captcha=false` override is sent. Service acceptance cannot independently prove mailbox delivery.

## Required live verification — not completed locally

1. Publish the updated **contents of `site/` only** to the GitHub Pages repository. Do not publish the workspace root or reference documents.
2. Open `https://elie-bitonda.github.io/elie-bitonda-portfolio/` and confirm the latest Baho case study and contact form are present. Hard-refresh if necessary.
3. Submit **one** real activation enquiry using your own valid visitor email. Suggested subject: `Activation check`.
4. Open **ebitonda@andrew.cmu.edu**, check Inbox and Spam/Junk, and open the FormSubmit activation/confirmation email.
5. Follow its confirmation link. Do not consider delivery active before this is complete.
6. Return to the deployed portfolio and submit **one second** enquiry with a distinct subject, such as `Post-activation delivery check`.
7. Verify that a new message arrives with subject **Portfolio Contact — Post-activation delivery check**, all four submitted fields, and a Reply-To matching the visitor email. Try Reply without sending to confirm its destination.

Do not send repeated tests automatically. If either message fails to appear, check spam/quarantine and provider activation status before trying again. The visible direct-email link remains available.

Local QA intercepts requests and checks payload, success/failure states and duplicate prevention. It sends no email, performs no activation, and does not verify delivery. This workspace is not connected to a publishing Git repository, so deployment was not performed here.

Provider references: [FormSubmit setup and email options](https://formsubmit.co/), [AJAX documentation](https://formsubmit.co/ajax-documentation).
