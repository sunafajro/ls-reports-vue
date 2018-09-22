<template>
  <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
    <div :key="office" v-for="office in Object.keys(rows)" v-if="typeof rows === 'object' && Object.keys(rows).length">
      <h3>{{ rows[office].name }} <small><span title="Наличные"><i class="fa fa-money" aria-hidden="true"></i> {{ rows[office].counts.cash | formatNumber  }}</span>&nbsp;&nbsp;<span title="Карта"><i class="fa fa-credit-card" aria-hidden="true"></i> {{ rows[office].counts.card | formatNumber  }}</span>&nbsp;&nbsp;<span title="Банк"><i class="fa fa-university" aria-hidden="true"></i> {{ rows[office].counts.bank | formatNumber  }}</span>&nbsp;&nbsp;<span title="Всего"><i class="fa fa-rub" aria-hidden="true"></i> {{ rows[office].counts.all | formatNumber  }}</span></small></h3>
      <div :key="date" v-for="date in Object.keys(rows[office])" v-if="typeof rows === 'object' && Object.keys(rows[office]).length > 1 && date !== 'name' && date !== 'counts'">
        <h4>{{ date }}</h4>
        <table class="table table-striped table-bordered table-hover table-condensed small">
          <thead v-if="columns.length">
            <th :key="`th-${column.id}`" v-for="column in columns" v-if="column.show">{{ column.name }}</th>
          </thead>
          <tbody v-if="rows[office][date].length">
            <tr :class="row.active === '0' ? 'danger' : ''" :key="`tr-${row.id}`" v-for="row in rows[office][date]" >
              <td :class="column.id === 'type' ? colors[row[column.id]] : ''" :key="`td-${row.id}-${column.id}`" :width="column.width" v-for="column in columns" v-if="column.show"><span v-if="row.active ==='1'">{{ row[column.id] }}</span><del v-if="row.active === '0'">{{ row[column.id] }}</del></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <h3 class="text-center" v-if="typeof rows === 'object' && Object.keys(rows).length">
      <span title="Наличные"><i class="fa fa-money" aria-hidden="true"></i> {{ total.cash | formatNumber }}</span>&nbsp;&nbsp;<span title="Карта"><i class="fa fa-credit-card" aria-hidden="true"></i> {{ total.card | formatNumber  }}</span>&nbsp;&nbsp;<span title="Банк"><i class="fa fa-university" aria-hidden="true"></i> {{ total.bank | formatNumber  }}</span>&nbsp;&nbsp;<span title="Всего"><i class="fa fa-rub" aria-hidden="true"></i> {{ total.all | formatNumber  }}</span>
    </h3>
  </div>
</template>

<script>
import numeral from "numeral";

export default {
  computed: {
    total() {
      const result = {
        cash: 0,
        card: 0,
        bank: 0,
        all: 0
      };
      if (typeof this.rows === "object" && Object.keys(this.rows).length) {
        Object.keys(this.rows).forEach(o => {
          result.cash += this.rows[o].counts.cash;
          result.card += this.rows[o].counts.card;
          result.bank += this.rows[o].counts.bank;
          result.all += this.rows[o].counts.all;
        });
      }
      return result;
    }
  },
  data() {
    return {
      colors: {
        Банк: "warning",
        Карта: "info",
        Наличные: "success"
      }
    };
  },
  filters: {
    formatNumber(value) {
      return numeral(value).format("0,0");
    }
  },
  props: {
    columns: {
      required: true,
      type: Array
    },
    rows: {
      required: true,
      type: Object
    }
  }
};
</script>
