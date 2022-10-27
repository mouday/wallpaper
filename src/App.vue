<template>
  <div class="container">
    <el-date-picker
      style="width: 140px"
      v-model="date"
      type="date"
      placeholder="日期"
      size="mini"
      format="yyyy-MM-dd"
      value-format="yyyy/MM/dd"
      @change="getData"
    >
    </el-date-picker>

    <el-button
      style="margin-left: 10px"
      size="mini"
      type="primary"
      @click="handleDownload"
      >下载</el-button
    >

    <div v-loading="loading">
      <div class="headline">{{ detail.headline }}</div>
      <div class="title">{{ detail.title }}</div>
      <div class="main_text">{{ detail.main_text }}</div>
      <div class="description">{{ detail.description }}</div>

      <img
        :src="detail.image_url"
        class="image"
        alt=""
        srcset=""
      />
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
      loading: true,
      date: dayjs().format('YYYY/MM/DD'),
      detail: {},
    }
  },

  computed() {},

  methods: {
    async getData() {
      this.loading = true

      const res = await axios.get(
        `https://mouday.github.io/wallpaper-database/${this.date}.json`
      )
      // console.log(res.data)

      this.detail = res.data
      this.loading = false
    },

    handleDownload() {
      FileSaver.saveAs(this.detail.image_url)
    },
  },

  created() {
    this.getData()
  },
}
</script>

<style lang="less"></style>
