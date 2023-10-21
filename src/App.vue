<script>
import LeadForm from "./components/LeadForm.vue";
export default {
  components: {
    LeadForm,
  },
  data: () => ({}),
};
</script>

<template>
  <header>
    <h1>Help Protect Your Home with a New Security System</h1>
    <p>
      Quick and easy. Get matched with the best Home Security company in your
      area
    </p>
  </header>

  <main class="my-5">
    <lead-form></lead-form>
  </main>

  <section class="my-5">
    <h2>How it works</h2>
    <p>
      Safe Home Pros services hundreds of brands and provides trusted
      information for millions of individuals across the United States
    </p>

    <ul class="ml-4">
      <li>Easily compare competitors</li>
      <li>Strengthen your consumer awareness</li>
      <li>Find the best rates for your financial needs</li>
    </ul>
  </section>

  <footer class="pt-5">
    <p>
      Safe Home Pros offers rankings and reviews for the top companies in many
      verticals across different industries in the United States. We strive to
      remain both objective and informative, with the goal of giving our users
      the best experience. The opinions and the prices we represent on our
      site(s) are subject to change without notice. We are an independent,
      advertising-supported comparison service. The offers that appear on this
      site are from companies that compensate us. This compensation may impact
      how and where products appear on this site, including, for example, the
      order in which they may appear within the listing categories. Copyright ©
      2023 Safe Home Pros.
    </p>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
}

footer {
  font-size: 14px;
  border-top: 1px solid #eaeaea;
  background-color: #fafafa;
}
</style>
