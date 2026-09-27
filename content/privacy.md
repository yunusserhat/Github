---
commentable: false
date: "2026-09-27T00:00:00+03:00"
draft: false
editable: false
header:
  caption: ""
  image: ""
share: false
title: Privacy Policy
---

This page describes how this website and its office-hours booking feature handle information.

## Information collected when you browse

This site loads Google Analytics 4 and Google Tag Manager. These services may receive usage, device, and network information and may use cookies or similar technologies. The site does not currently offer a cookie consent control.

The site also loads the Supabase JavaScript client from jsDelivr and includes links to external social, map, and academic services. Those providers may receive the usual technical information associated with a browser request or an outbound visit.

## Office-hours booking

If you use the booking page, Supabase Auth sends a one-time verification email to the official university email address you enter. The booking flow accepts only `@marun.edu.tr` and `@marmara.edu.tr` addresses. Supabase Auth limits how often codes can be requested. If a security check is shown on the sign-in form, it is provided by Cloudflare Turnstile, which receives technical information about your browser and connection to distinguish people from automated requests.

After verification, the booking system stores the authenticated user ID and email address, appointment start and end times, meeting type, configured location or meeting link, meeting topic, optional note, status, and creation and update timestamps. This information is used to display availability, enforce booking rules, manage cancellations, and send appointment notifications.

Booking notifications are sent through Resend to the student and the configured administrator. A confirmation email includes an optional Google Calendar link; Google receives the event details when that link is opened, and whether the event is saved is then controlled by Google. Do not include sensitive information in the meeting topic or note.

The booking system's access rules are designed so appointment details are visible to the relevant student and authorised administrators.

## Your choices and questions

You can avoid the booking feature and contact the site owner directly at [yunusserhat@yunusserhat.com](mailto:yunusserhat@yunusserhat.com). For questions about access, correction, deletion, or the handling of an appointment record, use that address and include enough information to identify the request without sending unnecessary sensitive data.

Retention periods, legal basis, international-transfer details, and a formal rights-request process still need to be confirmed by the site owner. Contact the address above for current details; this page should not be relied on as a complete formal KVKK notice until those details are published.

This page may be updated when the site's analytics, booking, or notification services change.
