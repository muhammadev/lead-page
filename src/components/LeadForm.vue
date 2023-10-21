<script>
import _ from "lodash";

export default {
  data: () => ({
    items: Array.from({ length: 8 }).map((_, i) => ({
      title: `Step ${i + 1}`,
      subtitle: `Step ${i + 1} subtitle`,
      value: i + 1,
    })),
    questions: [
      {
        text: "What type of property do you own?",
        key: "property_type",
        answers: ["Owned", "Rented"],
      },
      {
        text: "What is your zip code?",
        key: "zip_code",
        answers: "",
      },
      {
        text: "What is your installation preference?",
        key: "installation_preference",
        answers: [
          "Professional installation",
          "Self installation",
          "No preference",
        ],
      },
      {
        text: "What home security features would you like to have?",
        key: "features",
        answers: [
          "Cameras",
          "Motion Sensors",
          "Glass break sensors",
          "Doorbell Cameras",
        ],
      },
      {
        text: "What kind of System do you need?",
        key: "system_type",
        answers: [
          "Burglar / intrusion",
          "Fire detection",
          "Both burglar and fire detection",
        ],
      },
      {
        text: "How many entrances exist?",
        key: "entrances",
        answers: ["1", "2-4", "5", "More than 5"],
      },
      {
        text: "What is your address?",
        key: "address",
        answers: "",
      },
      { text: "Your Details", key: "details", answers: "" },
    ],
    step: 1,
    valid: true,
    loading: false,
    form: {
      property_type: [],
      entrances: [],
      installation_preference: [],
      features: [],
      system_type: [],
      zip_code: "",
      city: "",
      state: "",
      address: "",
      phone_home: "",
      first_name: "",
      last_name: "",
      ip_campaign_id: "64b9ccf73e38c",
      ip_campaign_key: "mYFhzwtX7LKWBGgD34Tb",
    },
    nameRules: [
      (value) => {
        if (value) return true;

        return "Name is required.";
      },
      (value) => {
        if (value?.length <= 10) return true;

        return "Name must be less than 10 characters.";
      },
    ],
    emailRules: [
      (value) => {
        if (value) return true;

        return "E-mail is required.";
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;

        return "E-mail must be valid.";
      },
    ],
    disableStepperActions: false,
    invalidZipCode: false,
    zipCodeLoading: false,
    validating_phone: false,
    validPhoneNumber: true,
    validEmail: true,
    validating_email: false,
    success: false,
    error: false,
  }),
  methods: {
    async nextStep(nextHandler) {
      let res = await this.$refs.form.validate();
      if (res.valid) {
        nextHandler();
      }
    },
    async submit() {
      this.loading = true;

      // validate form before submit
      let res = await this.$refs.form.validate();
      if (res.valid) {
        const paramsArray = window.location.search.slice(1).split("&");
        // from s1 through s5 if exists add ip_s1 to ip_s5
        for (let i = 0; i < paramsArray.length; i++) {
          if (paramsArray[i].startsWith("s")) {
            this.form[`ip_s${i + 1}`] = paramsArray[i].split("=")[1];
          }
        }

        fetch("https://bluemodo.leadspediatrack.com/post.do", {
          method: "POST",
          body: JSON.stringify(this.form),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result === "success") {
              this.success = true;
            } else if (data.result === "failed") {
              this.error = true;
            }
          })
          .catch((error) => {
            this.error = true;
          });
      }

      this.loading = false;
    },
  },
  watch: {
    step(newVal) {
      this.disableStepperActions = !this.form[this.questions[newVal - 1].key]
        ? true
        : false;
    },
    "form.zip_code": {
      handler: _.debounce(async function (value) {
        this.zipCodeLoading = true;
        const apiUrl = `https://thezipcodes.com/api/v1/search?zipCode=${value}&countryCode=US&apiKey=7afbbd82282359c32415ee4e479175de`;

        const response = await fetch(apiUrl, { method: "GET" });

        const responseJson = await response.json();

        if (responseJson.location && responseJson.location.length > 0) {
          this.form.city = responseJson.location[0].city;
          this.form.state = responseJson.location[0].state;
        } else {
          this.invalidZipCode = true;
          this.form.city = "";
          this.form.state = "";
        }

        this.zipCodeLoading = false;
      }, 500),
    },
    "form.phone_home": {
      handler: _.debounce(async function (value) {
        if (value) {
          this.validating_phone = true;

          const apiUrl = `http://apilayer.net/api/validate?access_key=2d53c73cccab6edc6a8d3408132f8c14&number=${value}&country_code=&format = 1`;
          const response = await fetch(apiUrl, { method: "GET" });
          const responseJson = await response.json();

          if (responseJson?.valid === false) {
            this.validPhoneNumber = false;
          } else {
            this.validPhoneNumber = true;
          }

          this.validating_phone = false;
        }
      }, 750),
    },
    "form.email": {
      handler: _.debounce(async function (value) {
        if (value) {
          this.validating_email = true;

          const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=29fa9eaf3bfe42aa9d7231c07df21f7f&email=${value}`;
          const response = await fetch(apiUrl, { method: "GET" });
          const responseJson = await response.json();

          // if no error and email is valid
          if (
            responseJson.error === false &&
            responseJson.deliverability === "DELIVERABLE"
          ) {
            this.validEmail = true;
          } else {
            this.validEmail = false;
          }

          this.validating_email = false;
        }
      }, 1000),
    },
  },
};
</script>

<template>
  <v-form v-model="valid" ref="form">
    <v-stepper :items="items" hide-actions v-model="step" :key="step">
      <template #default="{ prev, next }">
        <div
          v-if="step !== 8"
          class="d-flex justify-space-between align-center w-100 pa-6"
        >
          <div>
            <v-btn color="primary" @click="prev" v-show="step > 1">
              Back
            </v-btn>
          </div>
          <div>
            <v-btn
              color="primary"
              @click="nextStep(next)"
              v-show="step < items.length"
            >
              Next
            </v-btn>
          </div>
        </div>

        <div v-else class="d-flex justify-end align-center pa-6">
          <v-btn color="primary" @click="submit" :loading="loading">
            Submit
          </v-btn>
        </div>
      </template>
      <!-- <v-stepper-header>
      <template v-for="(item, i) in items" :key="i">
        <v-divider v-if="i"></v-divider>

        <v-stepper-item v-bind="item"></v-stepper-item>
      </template>
    </v-stepper-header> -->
      <template v-slot:[`item.1`]>
        <v-select
          v-model="form.property_type"
          :rules="[(v) => !!v.length || 'Property type is required']"
          :label="questions[step - 1].text"
          :items="questions[step - 1].answers"
        ></v-select>
      </template>

      <template v-slot:[`item.2`]>
        <v-text-field
          v-model="form.zip_code"
          :rules="[(v) => !!v || 'Zip code is required']"
          :label="questions[step - 1].text"
          :loading="zipCodeLoading"
        ></v-text-field>

        <v-row>
          <v-col>
            <v-text-field
              :rules="[(v) => !!v || 'City is required']"
              label="City"
              v-model="form.city"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              :rules="[(v) => !!v || 'State is required']"
              label="State"
              v-model="form.state"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template v-slot:[`item.3`]>
        <v-select
          v-model="form.installation_preference"
          :rules="[(v) => !!v.length || 'Installation preference is required']"
          :label="questions[step - 1].text"
          :items="questions[step - 1].answers"
        ></v-select>
      </template>

      <template v-slot:[`item.4`]>
        <v-select
          v-model="form.features"
          multiple
          :rules="[(v) => !!v.length || 'Features field is required']"
          :label="questions[step - 1].text"
          :items="questions[step - 1].answers"
        ></v-select>
      </template>

      <template v-slot:[`item.5`]>
        <v-select
          v-model="form.system_type"
          :rules="[(v) => !!v.length || 'System type is required']"
          :label="questions[step - 1].text"
          :items="questions[step - 1].answers"
        ></v-select>
      </template>

      <template v-slot:[`item.6`]>
        <v-select
          v-model="form.entrances"
          :rules="[(v) => !!v.length || 'Entrances field is required']"
          :label="questions[step - 1].text"
          :items="questions[step - 1].answers"
        ></v-select>
      </template>

      <template v-slot:[`item.7`]>
        <v-text-field
          v-model="form.address"
          :rules="[(v) => !!v || 'Address is required']"
          :label="questions[step - 1].text"
        ></v-text-field>
      </template>

      <template v-slot:[`item.8`]>
        <div>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.first_name"
                :rules="[(v) => !!v || 'First name is required']"
                label="First Name"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="form.last_name"
                :rules="[(v) => !!v || 'Last name is required']"
                label="Last Name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.email"
                :rules="[(v) => !!v || 'Email is required']"
                label="Email"
                :loading="validating_email"
                type="email"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.phone_home"
                :rules="[
                  (v) => !!v || 'Phone number is required',
                  (v) => validPhoneNumber || 'Invalid phone number',
                ]"
                label="Phone"
                type="tel"
                :loading="validating_phone"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-stepper>
  </v-form>

  <v-snackbar color="error" v-model="invalidZipCode" timeout="2000">
    Invalid zip code. Please fill the city and state fields.
  </v-snackbar>

  <v-snackbar color="success" v-model="success" timeout="2000">
    Posted successfully!
  </v-snackbar>

  <v-snackbar color="error" v-model="error" timeout="2000">
    Sorry! Something went wrong.
  </v-snackbar>

  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
