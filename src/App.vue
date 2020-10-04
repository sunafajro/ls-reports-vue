<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div class="alert alert-warning" v-if="loading">Идет загрузка данных...</div>
    </div>
    <Sidebar
      :filter="filter"
      :filters="filters"
      :menu="menu"
      :mode="mode"
      :setFilter="setFilter"
      :user="user"
      v-if="!loading"
    />
    <Content :columns="columns" :rows="rows" v-if="!loading"/>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import Noty from 'noty';
import Content from "./components/Content.vue";
import Sidebar from "./components/Sidebar.vue";
import { getMonths, getYears } from "./utils";

moment.locale("ru");

const el = document.getElementById('app');
const urlPrefix = el.dataset.urlPrefix;

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
      this.payments.columns = result[0].data.salariesData.columns;
      this.payments.rows = !Array.isArray(result[0].data.salariesData.rows)
        ? result[0].data.salariesData.rows
        : {};
      this.user = result[1].data.userData;
      this.loading = false;
    } catch (e) {
      this.error = true;
      new Noty({
        theme: 'bootstrap-v3',
        text: 'При загрузке данных произошла ошибка.',
        timeout: 3000,
        type: 'danger',
        progressBar: false,
      }).show();
    }
  },
  data() {
    let month = moment().month();
    return {
      payments: {
        columns: [],
        rows: {}
      },
      error: false,
      filter: {
        month: month > 9 ? month : `0${month}`,
        year: String(moment().year())
      },
      filters: {
        months: getMonths(),
        years: getYears(this.nullYear)
      },
      loading: true,
      menu: [],
      mode: el.dataset.mode,
      nullYear: parseInt(el.dataset.nullYear),
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
      if (this.filter.month && this.filter.year) {
        start = `${this.filter.year}-${this.filter.month}-01`;
        end = moment(start)
          .endOf("month")
          .format("YYYY-MM-DD");
      }
      return axios.post(`${urlPrefix}/report/salaries?start=${start}&end=${end}`);
    },
    getUserInfo() {
      return axios.get(`${urlPrefix}/user/app-info`);
    },
    async setFilter(filter) {
      this.filter = filter;
      if (this.filter.month) {
        const { data } = await this.getReportData();
        this.payments.rows = !Array.isArray(data.salariesData.rows)
          ? data.salariesData.rows
          : {};
      }
    },
  }
};
</script>
