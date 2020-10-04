<template>
  <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
    <breadcrumbs-component />
    <div :key="teacher" v-for="teacher in Object.keys(rows)">
      <h3>
        {{ rows[teacher].name }}&nbsp;&nbsp;
        <div class="small">
          <span title="Всего">
            <i class="fa fa-rub" aria-hidden="true"></i>
            {{ formatNumber(rows[teacher].counts.all) }}
          </span>
        </div>
      </h3>
      <table
        class="table table-striped table-bordered table-hover table-condensed small"
      >
        <thead v-if="columns.length">
          <th :key="`th-${column.id}`" v-for="column in visibleColumns">
            {{ column.name }}
          </th>
        </thead>
        <tbody
          v-if="
            Array.isArray(rows[teacher].rows) &&
            rows[teacher].rows.length
          "
        >
          <tr
            :key="`tr-${row.id}`"
            v-for="row in rows[teacher].rows"
          >
            <td
              :key="`td-${row.id}-${column.id}`"
              :width="column.width"
              v-for="column in visibleColumns"
            >
              <span v-if="!column.icon">{{ column.id !== 'date' ? row[column.id] : formatDate(row[column.id]) }}</span>
              <i
                :class="column.icon + ' ' + row[column.id]"
                aria-hidden="true"
                v-if="column.icon && row[column.id]"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3
      class="text-center"
      v-if="typeof rows === 'object' && Object.keys(rows).length > 1"
    >
      <div>
        <span title="Всего">
          <i class="fa fa-rub" aria-hidden="true"></i>
          {{ formatNumber(total.all) }}
        </span>
      </div>
    </h3>
  </div>
</template>

<script>
import moment from 'moment';
import numeral from 'numeral';
import Breadcrumbs from './Breadcrumbs.vue';

export default {
  components: {
    'breadcrumbs-component': Breadcrumbs,
  },
  computed: {
    total() {
      const result = {
        all: 0,
      };
      if (typeof this.rows === 'object' && Object.keys(this.rows).length) {
        Object.keys(this.rows).forEach((o) => {
          result.all += this.rows[o].counts.all;
        });
      }
      return result;
    },
    visibleColumns() {
      return this.columns.filter((c) => c.show);
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format('DD.MM.YYYY');
    },
    formatNumber(value) {
      return numeral(value).format('0,0');
    },
  },
  props: {
    columns: {
      required: true,
      type: Array,
    },
    rows: {
      required: true,
      type: Object,
    },
  },
};
</script>
