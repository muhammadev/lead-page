import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as VStepperComponents from "vuetify/labs/VStepper";

import lodash from "lodash";
window._ = lodash;

const vuetify = createVuetify({
  components: {
    ...components,
    ...VStepperComponents,
  },
  directives,
});

createApp(App).use(vuetify).mount("#app");
