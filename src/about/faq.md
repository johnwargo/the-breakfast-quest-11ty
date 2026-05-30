---
layout: generic
title: Frequently Asked Questions
eleventyNavigation:
  key: FAQ
  order: 2
  parent: About
pagination:
  data: faq-entries
  size: 20
  alias: faqs
---

<hr class="major" />
{% for faq in faqs %}
  <article>
    <h4>{{ faq.question}}</h4>
    <p>{{ faq.answer }}</p>
    <hr class="major" />
  </article>
{% endfor %}
