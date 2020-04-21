<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:55:39
 -->
<template>
  <div class="parameter-wapper">
    <section class="parameter-section">系统管理/管理员管理</section>
    <!--        基本信息 -->
    <div>
      <section class="parabth">
        <div class="parabthtext">
          基本信息
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible1=true"></el-link>
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible1"
          >
            <el-form :model="setValuel">
              <el-form-item label="平台联系电话" label-width="100px;">
                <el-input class="input" v-model="setValuel.value" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible1 = false">取 消</el-button>
              <el-button type="primary" @click="setplatform">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>
        <span v-for="(item,idx) in value1" :key="idx">{{ item }}</span>
      </p>
    </div>
    <!--            平台税率设置  -->
    <div>
      <section class="parabth">
        <div class="parabthtext">
          平台税率设置
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible2=true"></el-link>
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible2"
          >
            <el-form :model="setValue2">
              <el-form-item label="平台税率设置">
                <el-input class="input" v-model="setValue2.value" autocomplete="off"></el-input>%
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false">取 消</el-button>
              <el-button type="primary" @click="tax">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>
        <span>{{ value2.title }}</span>
        <span>{{ value2.value }}%</span>
      </p>
    </div>
    <!-- 外卖热门搜索设置 -->
    <div>
      <section class="parabth parabth3">
        <div class="parabthtext" style="line-height:47px">外卖热门搜索设置</div>
      </section>
      <p class="tag-p">
        <el-tag
          :key="idx"
          v-for="(tag,idx) in dynamicTags1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          type="text"
          class="button-new-tag"
          size="small"
          @click="dialogFormVisible7 = true"
        >+新增</el-button>
        <el-dialog
          title="设置"
          class="elt"
          :show-close="true"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible7"
        >
          <el-form>
            <el-form-item label="外卖热门搜索设置" label-width="140px">
              <el-input class="input" v-model="post_TakeoutSearch" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible7 = false">取 消</el-button>
            <el-button type="primary" @click="postTakeoutSearch">确 定</el-button>
          </div>
        </el-dialog>
      </p>
    </div>
    <!-- 小哥自营热门搜索设置 -->
    <!-- <div>
      <section class="parabth parabth3">
        <div class="parabthtext">
          <el-button type="text" @click="dialogFormVisible9 = false">小哥自营热门搜索设置</el-button>
        </div>
      </section>
      <p class="tag-p">
        <el-tag
          :key="idx"
          v-for="(tag,idx) in dynamicTags2"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          type="text"
          class="button-new-tag"
          size="small"
          @click="dialogFormVisible9 = true"
        >+ New Tag</el-button>
        <el-dialog title="设置" class="elt" :show-close="false" :visible.sync="dialogFormVisible9">
          <el-form :model="form">
            <el-form-item label="小哥自营热门搜索设置" :label-width="0">
              <el-input class="input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible9 = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible9 = false">确 定</el-button>
          </div>
        </el-dialog>
      </p>
    </div>-->
    <!-- 商户端商品标签设置 -->
    <!-- <div>
      <section class="parabth parabth3">
        <div class="parabthtext">
          <el-button type="text" @click="dialogFormVisible = true">商城热门搜索设置</el-button>

          <el-dialog title="设置" class="elt" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="商户端商品标签设置" style="m" :label-width="formLabelWidth">
                <el-input class="input" v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="tag-p">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </p>
    </div>-->
    <!--商户端商品标签设置  -->
    <!-- <div>
      <section class="parabth parabth3">
        <div class="parabthtext">
          <el-button type="text" @click="dialogFormVisible = true">商户端商品标签设置</el-button>
          <el-dialog title="设置" class="elt" :show-close="false" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="商户端商品标签设置" :label-width="formLabelWidth">
                <el-input class="input" v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="tag-p">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </p>
    </div>-->
    <!--    分销直推人数设置 -->
    <div>
      <section class="parabth parabth4">
        <div class="parabthtext">
          分销直推人数设置
          <!-- <img src="../../assets/img/icon_bianji.png" @click="dialogFormVisible3=true" /> -->
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible3=true"></el-link>

          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible3"
          >
            <el-form :model="setValue3">
              <el-form-item label=" 分销直推人数设置" :label-width="0">
                <el-input class="input" v-model="setValue3.value" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible3 = false">取 消</el-button>
              <el-button type="primary" @click="distri">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>
        <span v-for="(item,idx) in value3" :key="idx">{{ item }}</span>
      </p>
    </div>
    <!--       外卖订单抽佣每单保底费 -->
    <div>
      <section class="parabth parabth4">
        <div class="parabthtext">
          外卖订单抽佣每单保底费
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible4=true"></el-link>

          <!-- <img src="../../assets/img/icon_bianji.png" @click="dialogFormVisible4=true" /> -->
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible4"
          >
            <el-form :model="setValue4">
              <el-form-item label="外卖订单抽佣每单保底费" :label-width="0">
                <el-input class="input" v-model="setValue4.value" autocomplete="off"></el-input>元
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible4 = false">取 消</el-button>
              <el-button type="primary" @click="least">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>
        <span>{{ value4.title }}</span>
        <span>{{ value4.value}}元</span>
      </p>
    </div>
    <!--骑手配送费抽佣设置 -->
    <div>
      <section class="parabth parabth4">
        <div class="parabthtext">
          骑手配送费抽佣设置
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible5=true"></el-link>
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible5"
          >
            <el-form :model="setValue5">
              <el-form-item
                label="骑手配送费抽佣金额"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:70px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.rider_bro.value"
                  autocomplete="off"
                ></el-input>元
              </el-form-item>
              <el-form-item
                label="骑手站长分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; "
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.rider_head_bro.value"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="市代分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:50px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.city_bro.value"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="区代分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; "
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.area_bro.value"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="骑手引荐人分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:50px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.rider_refe_bro.value"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="平台分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block;"
              >
                <el-input
                  style="width:100px;"
                  v-model="setValue5.platform_bro.value"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item label="兼职骑手配送费抽佣金额" label-width="180px" style="display: inline-block;">
                <el-input
                  style="width:100px;"
                  v-model="setValue5.part_time_rider_bro.value"
                  autocomplete="off"
                ></el-input>元
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible5 = false">取 消</el-button>
              <el-button type="primary" @click="formdata">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="chouyong">
        <span>
          骑手配送费抽佣金额
          {{value5.rider_bro.value}}元
        </span>
        <span>
          骑手站长分佣比例
          {{value5.rider_head_bro.value}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          市代分佣比例
          {{value5.city_bro.value}}%
        </span>
        <span>
          区代分佣比例
          {{value5.area_bro.value}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          骑手引荐人分佣比例
          {{value5.rider_refe_bro.value}}%
        </span>
        <span>
          平台分佣比例
          {{value5.platform_bro.value}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          兼职骑手配送费抽佣金额
          {{value5.part_time_rider_bro.value}}元
        </span>
      </p>
    </div>
    <!--用户消费抽佣  -->
    <div>
      <section class="parabth parabth4">
        <div class="parabthtext">
          用户消费抽佣设置
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible6=true"></el-link>

          <!-- <img src="../../assets/img/icon_bianji.png" @click="dialogFormVisible6=true" /> -->
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible6"
          >
            <el-form :model="set_userTake">
              <el-form-item
                label="省代分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:70px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="set_userTake.province_bro"
                  autocomplete="off"
                ></el-input>元
              </el-form-item>
              <el-form-item
                label="市代分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; "
              >
                <el-input style="width:100px;" v-model="set_userTake.city_bro" autocomplete="off"></el-input>%
              </el-form-item>
              <el-form-item
                label="区代分佣比例 "
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:70px;"
              >
                <el-input style="width:100px;" v-model="set_userTake.area_bro" autocomplete="off"></el-input>%
              </el-form-item>
              <el-form-item
                label="平台分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:70px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="set_userTake.platform_bro"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="V哥直推分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block;margin-right:70px;"
              >
                <el-input style="width:100px;" v-model="set_userTake.direct_bro" autocomplete="off"></el-input>%
              </el-form-item>
              <el-form-item
                label="V哥间推分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block;margin-right:70px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="set_userTake.indirect_bro"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
              <el-form-item
                label="自消费分佣比例"
                :label-width="formLabelWidth"
                style="display: inline-block;margin-right:70px;"
              >
                <el-input style="width:100px;" v-model="set_userTake.self_bro" autocomplete="off"></el-input>%
              </el-form-item>
              <el-form-item
                label="商家引荐人"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:70px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="set_userTake.shop_recommend_bro"
                  autocomplete="off"
                ></el-input>%
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible6 = false">取 消</el-button>
              <el-button type="primary" @click="user_take_data">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="chouyong">
        <span>
          省代分佣比例
          {{user_take.province_bro}}%
        </span>

        <span>
          市代分佣比例
          {{user_take.city_bro}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          区代分佣比例
          {{user_take.area_bro}}%
        </span>
        <span>
          平台分佣比例
          {{user_take.platform_bro}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          V哥直推分佣比例
          {{user_take.direct_bro}}%
        </span>

        <span>
          V哥间推分佣比例
          {{user_take.indirect_bro}}%
        </span>
      </p>
      <p class="chouyong">
        <span>
          自消费分佣比例
          {{user_take.self_bro}}%
        </span>
        <span>
          商家引荐人比例
          {{user_take.shop_recommend_bro}}%
        </span>
      </p>
    </div>
    <!--  入驻平台保证金设置 -->
    <div>
      <section class="parabth parabth4">
        <div class="parabthtext">
          入驻平台保证金设置
          <el-link icon="el-icon-edit" :underline="false" @click="Visible=true"></el-link>
          <el-dialog
            title="设置"
            class="elt"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="Visible"
          >
            <el-form :model="form">
              <el-form-item
                label="商户入驻保证金"
                :label-width="formLabelWidth"
                style="display: inline-block; margin-right:50px;"
              >
                <el-input
                  style="width:100px;"
                  v-model="set_cash.shop_bail.value"
                  autocomplete="off"
                ></el-input>元
              </el-form-item>
              <el-form-item
                label="骑手入驻保证金"
                :label-width="formLabelWidth"
                style="display: inline-block; "
              >
                <el-input
                  style="width:100px;"
                  v-model="set_cash.rider_bail.value"
                  autocomplete="off"
                ></el-input>元
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="Visible = false">取 消</el-button>
              <el-button type="primary" @click="baildata">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="chouyong">
        <span>
          商户入驻保证金
          {{cash.shop_bail.value}}元
        </span>
        <span>
          骑手入驻保证金
          {{cash.rider_bail.value}}元
        </span>
      </p>
    </div>
    <!-- >配送时间设置 -->
    <div>
      <div class="tiem_div">
        <h1>配送时间设置</h1>
        <div class="addbth">
          <el-button type="primary" plain icon="el-icon-plus" @click="addNew">添加</el-button>
        </div>
        <section>
          <el-dialog
            title="新增&编辑"
            :show-close="false"
            :visible.sync="dialogTableVisible"
            width="500px"
            custom-class="dialog"
          >
            <el-divider></el-divider>
            <p class="P_box">
              <span class="span">班次名称：</span>
              <el-select class="select_iput" v-model="select_time_value" placeholder="请选择">
                <el-option
                  v-for="item in select_data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </p>
            <p class="p_div">
              <span class="span">时间：</span>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
      start: '00:00',
      step: '00:60',
      end: '23:00',
    }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
      start: '00:00',
      step: '00:60',
      end: '23:00',
      minTime: startTime
    }"
              ></el-time-select>
            </p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible = false">取 消</el-button>
              <el-button type="primary" @click="deliveryTime">确定</el-button>
            </span>
          </el-dialog>
        </section>
        <section class="s_tsble">
          <el-table
            :data="tableData"
            style="width: 380px"
            @selection-change="selectAll"
            :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'33px' }"
          >
            <el-table-column prop="title" label="班次" align="center" width="100"></el-table-column>
            <el-table-column prop="value" label="时间" align="center" width="100"></el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="{row}">
                <el-button @click="EditRow(row)" type="text">编辑</el-button>
                <el-button @click=" ClearRow(row)" type="text" style="color:red">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <section>
          <el-dialog
            title="新增&编辑"
            :show-close="false"
            :visible.sync="dialogTableVisible_time"
            width="500px"
            custom-class="dialog"
          >
            <el-divider></el-divider>
            <p class="P_box">
              <span class="span">班次名称：</span>
              <el-select class="select_iput" v-model="select_time_value" placeholder="请选择">
                <el-option
                  v-for="item in select_data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </p>
            <p class="p_div">
              <span class="span">时间：</span>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
      start: '00:00',
      step: '00:60',
      end: '23:00',
    }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
      start: '00:00',
      step: '00:60',
      end: '23:00',
      minTime: startTime
    }"
              ></el-time-select>
            </p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible_time= false">取 消</el-button>
              <el-button type="primary" @click="editDeliveryTime">确定</el-button>
            </span>
          </el-dialog>
        </section>
      </div>
    </div>

    <!--  信用值设置-->
    <div>
      <section class="parabth_xy parabth4">
        <div class="parabthtext">
          信用值设置
          <el-link icon="el-icon-edit" :underline="false" @click="dialogFormVisible8=true"></el-link>
          <el-dialog
            title="设置"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            class="elt"
            :visible.sync="dialogFormVisible8"
          >
            <el-form :model="setCredit" label-position="left">
              <div class="form_left">
                <el-form-item
                  label="新用户注册增加信用值"
                  label-width="160px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input v-model="setCredit.register[0]" autocomplete="off"></el-input>分
                </el-form-item>
                <el-form-item label="每次评价增加长值" label-width="140px" style="display: inline-block; ">
                  <el-input v-model="setCredit.evaluate[0]" autocomplete="off"></el-input>分
                </el-form-item>
              </div>
              <div class="form_left">
                <el-form-item
                  label="每次消费"
                  label-width="160px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input v-model="setCredit.consume[0]" autocomplete="off"></el-input>元
                </el-form-item>
                <el-form-item
                  label="信用值增加"
                  label-width="140px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input s v-model="setCredit.consume[1]" autocomplete="off"></el-input>分
                </el-form-item>
              </div>
              <div class="form_left">
                <el-form-item
                  label="每次充值小哥豆"
                  label-width="160px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input v-model="setCredit.recharge[0]" autocomplete="off"></el-input>豆
                </el-form-item>
                <el-form-item label="信用增加" label-width="140px" style="display: inline-block; ">
                  <el-input v-model="setCredit.recharge[1]" autocomplete="off"></el-input>分
                </el-form-item>
              </div>
              <div class="form_left">
                <el-form-item
                  label="每次分享增加成长值"
                  label-width="160px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input v-model="setCredit.share[0]" autocomplete="off"></el-input>分
                </el-form-item>

                <el-form-item label="每天限制" label-width="140px" style="display: inline-block;">
                  <el-input v-model="setCredit.share[1]" autocomplete="off"></el-input>次
                </el-form-item>
              </div>
              <div class="form_left">
                <el-form-item
                  label="每次打赏骑手"
                  label-width="160px"
                  style="display: inline-block; margin-right:98px;"
                >
                  <el-input v-model="setCredit.rewardRider[0]" autocomplete="off"></el-input>元
                </el-form-item>
                <el-form-item label="信用值增加" label-width="140px" style="display: inline-block;">
                  <el-input v-model="setCredit.rewardRider[1]" autocomplete="off"></el-input>分
                </el-form-item>
              </div>
              <div class="form_left">
                <el-form-item
                  label="每次提交意见反馈增加成长值"
                  label-width="200px"
                  style="display: inline-block; margin-right:60px;"
                >
                  <el-input v-model="setCredit.feedback[0]" autocomplete="off"></el-input>分
                </el-form-item>
                <el-form-item label="每天限制" label-width="140px" style="display: inline-block;">
                  <el-input v-model="setCredit.feedback[1]" autocomplete="off"></el-input>次
                </el-form-item>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible8 = false">取 消</el-button>
              <el-button type="primary" @click="setCreditData">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p class="xinyong">
        <span>
          新用户注册增加信用值：
          {{creditData.register[0]}}分
        </span>
        <span>
          每次评价增加长值：
          {{creditData.evaluate[0]}}分
        </span>
      </p>
      <p class="xinyong">
        <span>
          每次消费 {{creditData.consume[0]}}元，
          信用值增加: {{creditData.consume[1]}}分
        </span>
        <span>
          每次充值小哥 {{creditData.recharge[0]}}豆，
          信用增加： {{creditData.recharge[1]}}分
        </span>
      </p>
      <p class="xinyong">
        <span>
          每次分享增加成长值： {{creditData.share[0]}}分，
          每天限制 {{creditData.share[1]}}次
        </span>
        <span>
          每次打赏骑手 {{creditData.rewardRider[0]}}元，
          信用值增加： {{creditData.rewardRider[1]}}分
        </span>
      </p>
      <p class="xinyong">
        <span>
          每次提交意见反馈增加成长值： {{creditData.feedback[0]}}分，
          每天限制 {{creditData.feedback[1]}}次
        </span>
      </p>
    </div>

    <!-- 新用户注册小哥豆 -->
    <div>
      <section class="parabth_xy parabth4">
        <div class="parabthtext">
          新用户注册赠送小哥豆
          <el-link icon="el-icon-edit" :underline="false" @click="openXGbean"></el-link>
          <el-dialog
            title="新增&编辑"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            class="elt"
            :close="clear"
            width="fit-content"
            :visible.sync="dialogFormVisible_10"
          >
            <el-form label-position="left">
              <el-form-item label="新用户注册赠送小哥豆:" label-width="180px">
                <el-input v-model="setXGbean" autocomplete="off" placeholder="50" clearable></el-input>
              </el-form-item>
              <el-form-item label="使用期限:" label-width="100px">
                <el-date-picker
                  value-format="timestamp"
                  v-model="time_vals"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getBeanTime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="新用户注册赠送小哥豆" label-width="180px">
                <el-switch v-model="xgbeanBool" active-color="#4371e8" inactive-color="#ccc"></el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible_10 = false">取 消</el-button>
              <el-button type="primary" @click="setNewUserPresentBean">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>新用户注册赠送小哥豆 {{xgbean?xgbean:0}}，使用时间 {{xgbeanTime?xgbeanTime:'暂无'}}</p>
    </div>
    <!-- 新用户首单立减 -->
    <div>
      <section class="parabth_xy parabth4">
        <div class="parabthtext firstOrder">
          新用户首单立减
          <el-link icon="el-icon-edit" :underline="false" @click="openfirstOrder"></el-link>
          <el-dialog
            title="新增&编辑"
            :show-close="true"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            class="elt"
            :close="clear2"
            width="fit-content"
            :visible.sync="dialogFormVisible_11"
          >
            <el-form label-position="left">
              <el-form-item label="外卖模块" label-width="80px">
                <span class="txt">满</span>
                <el-input v-model="takeout_man" autocomplete="off" clearable maxlength="6" />
                <span class="txt">减</span>
                <el-input v-model="takeout_jian" autocomplete="off" clearable maxlength="6" />
              </el-form-item>
              <el-form-item label="商城模块" label-width="80px">
                <span class="txt">满</span>
                <el-input v-model="shop_man" autocomplete="off" clearable maxlength="6" />
                <span class="txt">减</span>
                <el-input v-model="shop_jian" autocomplete="off" clearable maxlength="6" />
              </el-form-item>
              <el-form-item label="团购模块" label-width="80px">
                <span class="txt">满</span>
                <el-input v-model="group_man" autocomplete="off" clearable maxlength="6" />
                <span class="txt">减</span>
                <el-input v-model="group_jian" autocomplete="off" clearable maxlength="6" />
              </el-form-item>
              <el-form-item label="京东优选" label-width="80px">
                <span class="txt">满</span>
                <el-input v-model="jd_man" autocomplete="off" clearable maxlength="6" />
                <span class="txt">减</span>
                <el-input v-model="jd_jian" autocomplete="off" clearable maxlength="6" />
              </el-form-item>
              <el-form-item label="使用期限:" label-width="100px">
                <el-date-picker
                  value-format="timestamp"
                  v-model="time_vals2"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getBeanTime2"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="新用户首单立减" label-width="160px">
                <el-switch v-model="firstOrderBool" active-color="#4371e8" inactive-color="#ccc"></el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible_11 = false">取 消</el-button>
              <el-button type="primary" @click="setNewUserFristBuy">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </section>
      <p>
        <span v-show="takeout_man2">外卖模块满{{takeout_man2}}减{{takeout_jian2}}，</span>
        <span v-show="group_man2">团购模块满{{group_man2}}减{{group_jian2}}，</span>
        <span v-show="shop_man2">商城模块满{{shop_man2}}减{{shop_jian2}}，</span>
        <span v-show="jd_man2">京东优选模块满{{jd_man2}}减{{jd_jian2}}</span>
      </p>
      <p v-show="firstOrderTimeVal">活动日期：{{firstOrderTimeVal}}</p>
    </div>
  </div>
</template>
<script>
import { deleteItem } from "@/utils/util.js";
export default {
  data() {
    return {
      creditData: {},
      setCredit: {},
      startTime: "",
      endTime: "",
      time_value: null,
      value1: "", //平台基本信
      setValuel: "",
      value2: "", //平台税率设置
      setValue2: "",
      value3: "", //分销设置
      setValue3: "",
      value4: "", //外卖订单抽佣每单保底费
      setValue4: "",
      value5: {}, //骑手配送费抽佣
      setValue5: {},
      user_take: {}, //用户抽佣
      set_userTake: {},
      cash: {}, //入驻平台保证金
      set_cash: {}, //入驻平台保证金
      gridData: [],
      dialogFormVisible_11: false, //设置首单
      dialogFormVisible_10: false, //设置赠送小哥豆
      dialogFormVisible9: false, //小哥自营热门搜索设置
      dialogFormVisible8: false, //信用值设置
      dialogFormVisible7: false,
      dialogFormVisible6: false,
      dialogFormVisible5: false, //专职骑手
      dialogFormVisible4: false,
      dialogFormVisible3: false,
      dialogFormVisible2: false,
      dialogFormVisible1: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      Visible: false, //入住平台
      dialogTableVisible_time: false,
      form: {
        region: "",
        delivery: false
      },
      value: "",
      rowId: Number,
      getTime: "",
      tableData: [],
      select_time_value: "",
      select_data: [
        {
          value: "早班",
          label: "早班"
        },
        {
          value: "中班",
          label: "中班"
        },
        {
          value: "晚班",
          label: "晚班"
        }
      ],
      formLabelWidth: "140px",
      dynamicTags1: [],
      dynamicTags2: [],
      post_TakeoutSearch: "",
      inputVisible: false,
      inputValue: "",
      setXGbean: "", //设置新用户新增小哥豆
      time_vals: "",
      create_time: [],
      setBeanBool: true,
      firstOrderBool: true,
      create_time2: [],
      time_vals2: "",
      xgbeanTime: "",
      xgbeanBool: true,
      beanTime: [],
      xgbean: "",
      //首单立减
      takeout_man: "",
      takeout_jian: "",
      shop_man: "",
      shop_jian: "",
      group_man: "",
      group_jian: "",
      jd_man: "",
      jd_jian: "",
      takeout_man2: "",
      takeout_jian2: "",
      shop_man2: "",
      shop_jian2: "",
      group_man2: "",
      group_jian2: "",
      jd_man2: "",
      jd_jian2: "",
      firstOrderTimeVal: "",
      firstOrderBool: true,
      firstOrderTime: []
    };
  },
  watch: {
    setBeanBool() {
      console.log(this.setBeanBool, "是否赠送小哥豆");
    }
  },
  created() {
    this.getdata();
    this.getUserCreditScore();
    this.NewUserPresentBean();
    this.getNewUserFristBuy();
  },
  mounted() {
    // this.getdata();
    // this.getUserCreditScore();
  },
  methods: {
    /**删除配送时间* */
    ClearRow(row) {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/delDeliveryTime",
        data: {
          id: row.delivery_time_id
        }
      }).then(res => {
        this.$message.success(res.data.msg);
        this.getdata();
      });
    },
    /**编辑配送时间**/
    EditRow(row) {
      this.dialogTableVisible_time = true;
      this.select_time_value = row.title;
      this.startTime = row.value.split("-")[0];
      this.endTime = row.value.split("-")[1];
      this.rowId = row.delivery_time_id;
    },
    editDeliveryTime() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/editDeliveryTime",
        data: {
          title: this.select_time_value,
          value: this.startTime + "-" + this.endTime,
          id: this.rowId
        }
      }).then(res => {
        this.$message.success(res.data.msg);
        this.getdata();
        this.dialogTableVisible_time = false;
      });
    },
    /**时间戳 */
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.getTime = startTime + "-" + endTime;
    },
    /**添加配送时间*/
    deliveryTime() {
      this.dialogTableVisible = false;
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/deliveryTimeAdd",
        data: {
          title: this.select_time_value,
          value: this.startTime + "-" + this.endTime
        }
      }).then(res => {
        this.$message.success(res.data.msg);
      });
    },

    //获取用户信用规则
    getUserCreditScore() {
      this.$get("/backend/ParamSetting/getUserCreditScore").then(res => {
        this.creditData = res.data.data;
        this.setCredit = JSON.parse(JSON.stringify(this.creditData));
      });
    },
    //设置用户信用规则
    setCreditData() {
      this.$post("/backend/ParamSetting/userCreditScore", {
        register: this.setCredit.register[0],
        evaluate: this.setCredit.evaluate[0],
        consume: this.setCredit.consume[0] + "-" + this.setCredit.consume[1],
        recharge: this.setCredit.recharge[0] + "-" + this.setCredit.recharge[1],
        share: this.setCredit.share[0] + "-" + this.setCredit.share[1],
        rewardRider:
          this.setCredit.rewardRider[0] + "-" + this.setCredit.rewardRider[1],
        feedback: this.setCredit.feedback[0] + "-" + this.setCredit.feedback[1]
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible8 = false;
          this.getUserCreditScore();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取参数
    getdata() {
      this.$axios({
        method: "GET",
        url: "/backend/ParamSetting/showParam"
      }).then(res => {
        this.dynamicTags1 = res.data.data.takeoutTopSearch;
        this.dynamicTags2 = res.data.data.takeoutTopSearch;

        this.tableData = deleteItem(
          res.data.data.paramData,
          "骑手配送时间"
        ).data.data;
        this.value1 = deleteItem(
          res.data.data.paramData,
          "平台基本信息"
        ).data.data.platform_tel;
        this.setValuel = JSON.parse(JSON.stringify(this.value1));
        this.value2 = deleteItem(
          res.data.data.paramData,
          "平台税率设置"
        ).data.data.tax_rate_value;
        this.setValue2 = JSON.parse(JSON.stringify(this.value2));
        this.value3 = deleteItem(
          res.data.data.paramData,
          "分销设置"
        ).data.data.distri_num;
        this.setValue3 = JSON.parse(JSON.stringify(this.value3));
        this.value4 = deleteItem(
          res.data.data.paramData,
          "外卖订单抽佣"
        ).data.data.least_bro;
        this.setValue4 = JSON.parse(JSON.stringify(this.value4));
        this.value5 = deleteItem(
          res.data.data.paramData,
          "骑手配送费抽佣"
        ).data.data;
        this.setValue5 = JSON.parse(JSON.stringify(this.value5));
        this.user_take = deleteItem(
          res.data.data.paramData,
          "用户消费抽佣"
        ).data.data;
        this.set_userTake = JSON.parse(JSON.stringify(this.user_take));
        this.cash = deleteItem(
          res.data.data.paramData,
          "入驻平台保证金"
        ).data.data;
        this.set_cash = JSON.parse(JSON.stringify(this.cash));
      });
    },
    //入驻平台保证金
    baildata() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/enterPlatformBail",
        data: {
          shop_bail: this.set_cash.shop_bail.value,
          rider_bail: this.set_cash.rider_bail.value
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.Visible = false;
          this.getdata();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //骑手配送费抽佣
    formdata() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/riderDeliveryBro",
        data: {
          part_time_rider_bro: this.setValue5.part_time_rider_bro.value,
          rider_bro: this.setValue5.rider_bro.value,
          rider_head_bro: this.setValue5.rider_head_bro.value,
          city_bro: this.setValue5.city_bro.value,
          area_bro: this.setValue5.area_bro.value,
          rider_refe_bro: this.setValue5.rider_refe_bro.value,
          platform_bro: this.setValue5.platform_bro.value
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible5 = false;
          this.getdata();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    /**用户消费抽佣 */
    user_take_data() {
      let that = this;
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/userBrokerage",
        data: {
          province_bro: this.set_userTake.province_bro,
          city_bro: this.set_userTake.city_bro,
          area_bro: this.set_userTake.area_bro,
          platform_bro: this.set_userTake.platform_bro,
          direct_bro: this.set_userTake.direct_bro,
          indirect_bro: this.set_userTake.indirect_bro,
          self_bro: this.set_userTake.self_bro,
          shop_recommend_bro: this.set_userTake.shop_recommend_bro
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible6 = false;
          this.getdata();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //外卖订单抽佣每单保底
    least() {
      let that = this;
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/takeOutBro",
        data: {
          least_bro: this.setValue4.value
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible4 = false;
          this.value4.value = this.setValue4.value;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //分销直推人数设置
    distri() {
      let that = this;
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/distribution",
        data: {
          distri_num: this.setValue3.value
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible3 = false;
          this.value3.value = this.setValue3.value;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //平台税率设置
    tax() {
      let that = this;
      console.log(this.form.tax);
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/taxRate",
        data: {
          tax_rate_value: this.setValue2.value
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible2 = false;
          this.value2.value = this.setValue2.value;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //平台联系电话
    setplatform() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/baseInfo",
        data: {
          platform_tel: this.setValuel.value1
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible1 = false;
          this.value1.value = this.setValuel.value1;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**配送时间 */
    addNew() {
      this.dialogTableVisible = true;
    },

    handleClose(tag) {
      console.log(tag);
      let that = this;
      that.dynamicTags1.splice(that.dynamicTags1.indexOf(tag), 1);
      that
        .$axios({
          method: "POST",
          url: "/backend/ParamSetting/delTakeoutSearch",
          data: {
            search_id: tag
          }
        })
        .then(res => {
          if (res.data.status == 1) {
            that.$message.success(res.data.msg);
            that.getdata();
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    // /**外卖热门设置***/
    postTakeoutSearch() {
      if (this.post_TakeoutSearch) {
        this.$axios({
          method: "POST",
          url: "/backend/ParamSetting/postTakeoutSearch",
          data: {
            title: this.post_TakeoutSearch
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.dialogFormVisible7 = false;
            this.getdata();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.error("标题不能为空");
      }
    },

    // 用户全选checkbox时触发该事件
    selectAll(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      return this.nid;
    },
    //获取新用户注册赠送小哥豆 /backend/ParamSetting/getNewUserPresentBean
    NewUserPresentBean() {
      this.$axios({
        method: "GET",
        url: "/backend/ParamSetting/getNewUserPresentBean",
        params: {}
      }).then(res => {
        console.log(res.data, "获取新用户注册赠送小哥豆");
        let { data } = res.data;
        this.beanTime = [];
        this.xgbeanTime = data.text;
        this.xgbean = data.num;
        this.xgbeanBool = data.status == 1 ? true : false;
        this.beanTime.push(data.start_time);
        this.beanTime.push(data.end_time);
      });
    },
    //获取新用户注册首单立减 /backend/ParamSetting/getNewUserFristBuy
    getNewUserFristBuy() {
      this.$axios({
        method: "GET",
        url: "/backend/ParamSetting/getNewUserFristBuy",
        params: {}
      }).then(res => {
        console.log(res.data, "获取新用户注册首单立减");
        let { data } = res.data;
        this.firstOrderTime = [];
        this.takeout_man2 = data.takeout.enough;
        this.takeout_jian2 = data.takeout.reduce;
        this.shop_man2 = data.shop.enough;
        this.shop_jian2 = data.shop.reduce;
        this.group_man2 = data.group.enough;
        this.group_jian2 = data.group.reduce;
        this.jd_man2 = data.jd.enough;
        this.jd_jian2 = data.jd.reduce;
        this.firstOrderTimeVal = data.text;
        this.firstOrderBool = data.status == 1 ? true : false;
        this.firstOrderTime.push(data.start_time);
        this.firstOrderTime.push(data.end_time);
      });
    },
    //打开小哥豆弹窗
    openXGbean() {
      this.dialogFormVisible_10 = true;
      // this.NewUserPresentBean();
      this.setXGbean = this.xgbean;
      if (this.beanTime.length > 0) {
        let arr = [];
        this.beanTime.forEach(item => {
          arr.push(item * 1000);
        });
        this.time_vals = arr;
      }
    },
    //设置新用户注册赠送小哥豆 /backend/ParamSetting/setNewUserPresentBean
    setNewUserPresentBean() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/setNewUserPresentBean",
        data: {
          present_num: this.setXGbean,
          start_time: this.create_time[0]
            ? this.create_time[0]
            : this.beanTime[0],
          end_time: this.create_time[1]
            ? this.create_time[1]
            : this.beanTime[1],
          status: this.xgbeanBool == true ? 1 : 0
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.NewUserPresentBean();
          this.$message.success(res.data.msg);
          this.dialogFormVisible_10 = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //设置首单满减
    openfirstOrder() {
      this.dialogFormVisible_11 = true;
      // this.getNewUserFristBuy();
      this.takeout_man = this.takeout_man2;
      this.takeout_jian = this.takeout_jian2;
      this.shop_man = this.shop_man2;
      this.shop_jian = this.shop_jian2;
      this.group_man = this.group_man2;
      this.group_jian = this.group_jian2;
      this.jd_man = this.jd_man2;
      this.jd_jian = this.jd_jian2;
      if (this.firstOrderTime.length > 0) {
        let arr = [];
        this.firstOrderTime.forEach(item => {
          arr.push(item * 1000);
        });
        this.time_vals2 = arr;
      }
    },
    //设置新用户注册首单立减 /backend/ParamSetting/setNewUserFristBuy
    setNewUserFristBuy() {
      this.$axios({
        method: "POST",
        url: "/backend/ParamSetting/setNewUserFristBuy",
        data: {
          takeout: this.takeout_man + "," + this.takeout_jian,
          shop: this.shop_man + "," + this.shop_jian,
          group: this.group_man + "," + this.group_jian,
          jd: this.jd_man + "," + this.jd_jian,
          start_time: this.create_time2[0]
            ? this.create_time2[0]
            : this.firstOrderTime[0],
          end_time: this.create_time2[1]
            ? this.create_time2[1]
            : this.firstOrderTime[1],
          status: this.firstOrderBool == true ? 1 : 0
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getNewUserFristBuy();
          this.$message.success(res.data.msg);
          this.dialogFormVisible_11 = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //选择时间
    getBeanTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time[0] = startTime;
      this.create_time[1] = endTime;
    },
    clear() {
      this.create_time = "";
      this.time_vals = "";
      this.setXGbean = "";
    },
    getBeanTime2(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time2[0] = startTime;
      this.create_time2[1] = endTime;
    },
    clear2() {
      this.create_time2 = "";
      this.time_vals2 = "";
      this.takeout_man = "";
      this.takeout_jian = "";
      this.shop_man = "";
      this.shop_jian = "";
      this.group_man = "";
      this.group_jian = "";
      this.jd_man = "";
      this.jd_jian = "";
    }
  }
};
</script>


<style lang="scss">
.parameter-wapper {
  margin-bottom: 400px;
  .parameter-section {
    width: 183px;
    height: 24px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .parabth {
    display: flex;
    align-items: center;
    margin-top: 41px;
    padding: 0 10px;
    width: fit-content;
    height: 47px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    i {
      font-size: 20px;
      margin-left: 10px;
      color: #4371e8;
    }
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      width: 723px;
      // height: 385px;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
    }
    .elt {
      // font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .input {
      width: 171px;
      height: 34px;
      border: 1px solid rgba(204, 204, 204, 1);
      border-radius: 2px;
    }
    .dialog-footer {
      // position: relative;
      // top: -25px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .parabth_xy {
    margin-top: 41px;
    width: 157px;
    height: 47px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    opacity: 1;
    border-radius: 4px;
    i {
      font-size: 20px;
      margin-left: 10px;
      color: #4371e8;
    }
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      min-width: 800px;
      width: fit-content;
      // height: 500px;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
    }
    .el-dialog__header {
      padding: 0.2rem 0.2rem 0.1rem;
      height: 0.1rem;
      position: relative;
      .el-dialog__title {
        line-height: 0.24rem;
        font-size: 0.18rem;
        color: #303133;
        font-weight: bold;
        position: absolute;
        top: 50%;
      }
    }
    //信用值的弹窗
    .el-dialog__body {
      .el-form {
        // margin: 0 auto;
        width: fit-content;
        // display: flex;
        // flex-wrap: wrap;
        .form_left {
          width: fit-content;
          color: #333;
        }
        .el-input {
          width: 80px;
          margin-right: 5px;
        }
      }
      .input {
        width: 171px;
        height: 34px;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 2px;
      }
    }

    .dialog-footer {
      // position: relative;
      // top: -25px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .parabth3 {
    padding-left: 10px;
    width: 188px;
    height: 47px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
  }
  .parabth4 {
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: fit-content;
    height: 47px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
  }
  .firstOrder {
    .txt {
      color: #333;
      margin: 0 10px 0 5px;
    }
    .el-input {
      width: 80px;
      margin-right: 5px;
    }
  }
  .parabthtext {
    display: flex;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    img {
      margin-left: 10px;
      cursor: pointer;
    }
    // .el-button--text {
    //   width: 83px;
    //   height: 26px;
    //   font-family: Microsoft YaHei;
    // }
  }
  p {
    margin-top: 16px;
    padding-left: 10px;
    width: fit-content;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: rgba(51, 51, 51, 1);
    span:nth-child(1) {
      margin-right: 10px;
    }
  }
  .tag-p {
    width: 100%;
    .el-tag + .el-tag {
      margin-left: 20px;
    }
    .button-new-tag {
      margin-left: 20px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
    }
    .input-new-tag {
      width: 90px;
      margin-left: 20px;
      vertical-align: bottom;
    }
    .input {
      width: 171px;
      height: 34px;
      border-radius: 2px;
    }
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      width: 723px;
      // height: 385px;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
    }
  }
  .chouyong {
    width: 450px;
    margin: 26px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    .span-input {
      width: 99px;
      height: 34px;
      text-align: center;
    }
  }
  .xinyong {
    width: 760px;
    margin: 26px 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    span {
      &:nth-child(1) {
        width: 404px;
      }
      &:nth-child(2) {
        margin-left: 30px;
      }
    }
  }

  .tiem_div {
    h1 {
      margin-top: 41px;
      height: 24px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      line-height: 24px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }
    .addbth {
      display: flex;
      margin-top: 15px;
    }

    .dialog {
      .el-dialog__header {
        position: relative;
        height: 20px;
        .el-dialog__title {
          position: absolute;
          top: 32px;
          left: 20px;
          font-size: 20px;
        }
      }
      .el-dialog__body {
        padding: 30px 20px;
        color: #606266;
        font-size: 0.14rem;
        word-break: break-all;
        height: 180px;
        .P_box {
          display: flex;
          height: 34px;
          .span {
            display: inline-block;
            width: 150px;
            line-height: 34px;
          }
          .select_iput {
            display: inline-block;
            width: 260px;
            line-height: 34px;
          }
        }
        .p_div {
          width: 400px;
          display: flex;
          height: 34px;
          .span {
            display: inline-block;
            width: 70px;
            line-height: 34px;
          }
        }
      }
      .el-dialog__footer {
        padding: 10px 20px 20px;
        text-align: right;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
      }
    }
  }
  .s_tsble {
    margin-top: 25px;
  }
}
</style>
