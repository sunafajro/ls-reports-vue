<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div class="alert alert-warning" v-if="loading">Идет загрузка данных...</div>
      <div class="alert alert-danger" v-if="error">Произошла непредвиденная ошибка!</div>
    </div>
    <Sidebar :filter="filter" :filters="filters" :menu="menu" :setFilter="setFilter" :updateWeeks="updateWeeks" :user="user" v-if="!loading" />
    <Content :columns="columns" :rows="rows" v-if="!loading"/>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Content from "./components/Content.vue";
import Sidebar from "./components/Sidebar.vue";
import { getMonths, getWeeks, getYears } from "./utils";

moment.locale("ru");

export default {
  name: "app",
  components: {
    Content,
    Sidebar
  },
  computed: {
    columns() {
      return this.details.columns;
    },
    rows() {
      // if (this.filter) {
      //   return this.details.rows.filter(
      //     item => item.date.substr(0, 4) === this.filter
      //   );
      // } else {
      return this.details.rows;
      // }
    }
  },
  async created() {
    try {
      const result = await Promise.all([
        this.getReportData(),
        this.getUserInfo()
      ]);
      this.menu = result[0].data.menuData;
      this.details = result[0].data.paymentsData;
      this.user = result[1].data.userData;
      this.loading = false;
    } catch (e) {
      this.error = true;
      this.loading = false;
    }
  },
  data() {
    return {
      details: {
        columns: [],
        rows: []
      },
      error: false,
      filter: {
        month: "",
        week: String(moment().week()),
        year: String(moment().year())
      },
      filters: {
        months: getMonths(),
        weeks: getWeeks(moment().format("YYYY")),
        years: getYears(this.nullYear)
      },
      loading: true,
      menu: [],
      user: {}
    };
  },
  methods: {
    getReportData() {
      return axios.post(`/report/payments`);
    },
    getUserInfo() {
      return axios.get("/user/get-info");
    },
    setFilter(filter) {
      this.filter = filter;
    },
    updateWeeks(year) {
      this.filters.weeks = getWeeks(year);
    }
  },
  props: {
    nullYear: {
      required: true,
      type: Number
    }
  }
};
</script>
