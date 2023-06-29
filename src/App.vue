<template>
  <div class="container">
    <div
      class="image"
      :style="backStyle"
    ></div>

    <div class="options">
      <el-tooltip
        effect="dark"
        content="<-键盘翻页"
        placement="top-start"
        :disabled="disabled"
      >
        <el-button
          style="margin-right: 10px"
          size="mini"
          type="default"
          @click="handleBefore"
        >
          <i class="el-icon-arrow-left"></i>
          前一天</el-button
        ></el-tooltip
      >

      <el-date-picker
        style="width: 140px"
        v-model="date"
        type="date"
        placeholder="日期"
        size="mini"
        clearable
        :editable="false"
        format="yyyy-MM-dd"
        value-format="yyyy/MM/dd"
        @change="getData"
      >
      </el-date-picker>

      <el-tooltip
        effect="dark"
        content="键盘翻页->"
        placement="top-start"
        :disabled="disabled"
      >
        <el-button
          style="margin-left: 10px"
          size="mini"
          type="default"
          @click="handleNext"
        >
          后一天
          <i class="el-icon-arrow-right"></i
        ></el-button>
      </el-tooltip>

      <div style="margin-left: auto">
        <el-button
          size="mini"
          type="default"
          @click="handleDownload"
        >
          <i class="el-icon-download"></i>
          下载</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="mini"
          type="default"
          @click="handleGithub"
        >
          <i class="el-icon-message"></i>
          github</el-button
        >
      </div>
    </div>

    <div class="description-wrap">
      <div class="description__header">
        <span class="title">《{{ detail.headline }}》{{ detail.title }}</span>
        <span class="description__view"
          ><i class="el-icon-view"></i> {{ viewCount }}</span
        >
      </div>

      <div class="description">
        {{ detail.main_text }}{{ detail.description }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'
import FileSaver from 'file-saver'

export default {
  data() {
    return {
      // tableData,
      disabled: false,
      loading: true,
      date: dayjs().format('YYYY/MM/DD'),
      detail: {},
      viewCount: 0,
      showMessage: false,
    }
  },

  computed: {
    backStyle() {
      if (this.detail && this.detail.image_url) {
        return {
          'background-image': `url("${this.detail.image_url}")`,
        }
      } else {
        return {}
      }
    },
  },

  methods: {
    async initData() {
      let isSuccess = await this.getData()

      this.showMessage = true
      
      // 如果未成功，取前一天数据
      if (!isSuccess) {
        this.date = dayjs().subtract(1, 'day').format('YYYY/MM/DD')
        this.getData()
      }
      
    },

    async getData() {
      this.loading = true

      let isSuccess = false
      try {
        const res = await axios.get(
          `https://mouday.github.io/wallpaper-database/${this.date}.json`
        )

        console.log(res)

        this.detail = res.data
        this.handleViewCount(this.date)
        isSuccess = true
      } catch (e) {
        console.log(e)
        if (this.showMessage) {
          this.$message.error('数据不存在')
        }
      } finally {
        this.loading = false
      }

      return isSuccess
    },

    handleDownload() {
      FileSaver.saveAs(this.detail.image_url)
    },

    handleBefore() {
      this.date = dayjs(this.date).subtract(1, 'day').format('YYYY/MM/DD')
      this.getData()
      this.disabled = true
    },

    handleNext() {
      this.date = dayjs(this.date).add(1, 'day').format('YYYY/MM/DD')
      this.getData()
      this.disabled = true
    },

    handleKeyDown(e) {
      if (e.key == 'ArrowRight') {
        this.handleNext()
      } else if (e.key == 'ArrowLeft') {
        this.handleBefore()
      }
    },

    handleViewCount(date) {
      let viewCount = localStorage.getItem(date)

      if (!viewCount) {
        viewCount = Number.parseInt(1000 * Math.random() + 5000)
      } else {
        viewCount = parseInt(viewCount) + 1
      }

      localStorage.setItem(date, viewCount)

      this.viewCount = viewCount
    },

    handleGithub() {
      window.open('https://github.com/mouday/wallpaper', '_blank')
    },
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
  },

  // 卸载
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  created() {
    this.initData()
  },
}
</script>

<style lang="less"></style>
