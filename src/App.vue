<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div class="alert alert-warning" v-if="loading">Идет загрузка данных...</div>
      <div class="alert alert-danger" v-if="error">Произошла непредвиденная ошибка!</div>
    </div>
    <Sidebar
      :filter="filter"
      :filters="filters"
      :menu="menu"
      :setFilter="setFilter"
      :updateWeeks="updateWeeks"
      :user="user"
      v-if="!loading"
    />
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
      return this.payments.columns;
    },
    rows() {
      return this.payments.rows;
    }
  },
  async created() {
    try {
      const result = await Promise.all([
        this.getReportData(),
        this.getUserInfo()
      ]);
      this.menu = result[0].data.menuData;
      this.payments.columns = result[0].data.paymentsData.columns;
      this.payments.rows = !Array.isArray(result[0].data.paymentsData.rows)
        ? result[0].data.paymentsData.rows
        : {};
      this.user = result[1].data.userData;
      this.loading = false;
    } catch (e) {
      this.error = true;
      this.loading = false;
    }
  },
  data() {
    return {
      payments: {
        columns: [],
        rows: {}
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
      let start = moment()
        .startOf("week")
        .format("YYYY-MM-DD");
      let end = moment()
        .endOf("week")
        .format("YYYY-MM-DD");
      if (this.filter.week && this.filter.year) {
        const d = this.filters.weeks.filter(
          item => item.value === this.filter.week
        );
        start = d[0].start;
        end = d[0].end;
      }
      if (this.filter.month && this.filter.year) {
        start = `${this.filter.year}-${this.filter.month}-01`;
        end = moment(start)
          .endOf("month")
          .format("YYYY-MM-DD");
      }
      return axios.post(`/report/payments?start=${start}&end=${end}`);
    },
    getUserInfo() {
      return axios.get("/user/get-info");
    },
    async setFilter(filter) {
      this.filter = filter;
      if (this.filter.week || this.filter.month) {
        const { data } = await this.getReportData();
        this.payments.rows = !Array.isArray(data.paymentsData.rows)
          ? data.paymentsData.rows
          : {};
      }
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
