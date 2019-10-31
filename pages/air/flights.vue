<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <flightsFilters :data="cacheFlightsData" @filterFlight="filterFlight" />
        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <FlightsItem v-for="(item ,index) in listData" :key="index" :data="item" />
          <!-- 分页 -->
          <!-- size-change:每页条数切换时出发 -->
          <!-- current-change：页码切换时触发 -->
          <!-- current-page：当前的页码 -->
          <!-- page-size：当前显示的条数 -->
          <!-- total：总条数 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[2, 5, 7, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->

      <!-- 侧边栏组件 -->
      <FlightsAside />
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsitem.vue";
import flightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";

export default {
  data() {
    return {
      flightsData: {
        info: {},
        options: {}
      },
      // 代表大数据，初始值和上面的flightsData是一样的
      // 这个变量一旦赋值之后不能再被修改了
      cacheFlightsData: {
        info: {},
        options: {}
      },

      pageIndex: 1, //当前的页码
      pageSize: 5, //当前的条数
      total: 0, //总条数
      listData: []
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    flightsFilters,
    FlightsAside
  },

  watch: {
    //  watch可以监听this下的所有属性
    $route() {
      // 请求航班数据
      this.getData()
    }
  },

  mounted() {

    this.getData()
  },
  methods: {
    // 获取航班信息数据
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        // console.log(res.data)
        this.flightsData = res.data;
        this.cacheFlightsData = { ...res.data };

        this.total = this.flightsData.total;
        this.listData = this.flightsData.flights.slice(0, this.pageSize);
      });
    },

    //   自定义一个事件，用来传递事件
    filterFlight(arr) {
      //   console.log(arr)
      //   console.log(this.flightsData.flights)

      this.flightsData.flights = arr;
      //   console.log(this.flightsData.flights)

      this.listData = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      this.total = arr.length;
    },

    //   每页条数切换时触发
    handleSizeChange(val) {
      this.pageSize = val;

      this.listData = this.flightsData.flights.slice(0, this.pageSize);
    },
    //   页码切换时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      //   console.log(this.pageIndex)
      this.listData = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>