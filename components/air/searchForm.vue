<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          @blur="departBlur"
          v-model="form.departCity"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          @blur="DestBlur"
          v-model="form.destCity"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "", //出发城市（不带 市 字）
        departCode: "", //出发城市代码
        destCity: "", //到达城市
        destCode: "", //到达城市代码
        departDate: "" //出发日期
      },
      departData: [],
      destData: []
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("不支持该功能", "提示");
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      if (!value) {
        cb([]);
        return;
      }
      this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        var newData = [];
        const { data } = res.data;
        data.forEach(v => {
          v.value = v.name.replace("市", "");
          newData.push(v);
        });
        //    默认选中第一个
        // this.form.departCity = newData[0].value;
        // this.form.departCode = newData[0].sort;
        //  console.log(newData)
        this.departData = newData;
        cb(newData);
      });
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      if (!value) {
        cb([]);
        return;
      }
      this.$axios({
        url: "/airs/city",
        params: {
          name: value
        }
      }).then(res => {
        console.log(res);
        var newData = [];
        const { data } = res.data;
        data.forEach(v => {
          v.value = v.name.replace("市", "");
          newData.push(v);
        });
        this.destData = newData;
        // this.form.destCity = '';
        // this.form.destCode = newData[0].sort;
        //  console.log(newData)
        cb(newData);
      });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      // console.log(item)
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, destCity, departCode, destCode } = this.form;
      // 交叉赋值
      this.form.destCity = departCity;
      this.form.departCity = destCity;

      this.form.departCode = destCode;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      //   console.log(this.form);
      const { departCity, destCity, departDate } = this.form;

      if (!departCity) {
        this.$alert("出发城市不能为空", "提示");
        return;
      }

      if (!destCity) {
        this.$alert("到达城市不能为空", "提示");
        return;
      }

      if (!departDate) {
        this.$alert("日期不能为空", "提示");
        return;
      }

      this.$router.push({
        path: "/air/flights",
        //   url携带的参数
        query: this.form
      });

      //  把本地存储先拿出来
      const arr = JSON.parse(localStorage.getItem("airs")) || [];
         arr.push(this.form)

    // 把搜索条件保存到本地
      localStorage.setItem('airs',JSON.stringify(arr))
    },
    // 出发城市输入框失焦
    departBlur() {
      if (this.departData[0]) {
        // this.form.departCity = ""
        this.form.departCity = this.departData[0].value;
        //  console.log( this.form.departCity)
      } else {
        this.form.departCity = "";
        // console.log( this.form.departCity)
      }

      //   this.form.departCity = this.departData[0] ? this.departData[0].value : "";

      this.form.departCode = this.departData[0] ? this.departData[0].sort : "";
    },
    // 到达城市输入框失焦
    DestBlur() {
      this.form.destCity = this.destData[0] ? this.destData[0].value : "";
      this.form.destCode = this.destData[0] ? this.destData[0].value : "";
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>