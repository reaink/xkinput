<template>
  <Row type="flex" justify="center">
    <Row style="max-width: 1200px; padding: 0 20px;">
      <Card>
        <Row class="main-textarea-box" type="flex" justify="center">
          <Col :xs="24" :sm="8">
            <div class="info" @click="showPlate.old = !showPlate.old">
              <span class="textarea-title">词库数据</span>
              <span class="textarea-info" v-html="count.old"></span>
            </div>
            <monaco-editor
              class="editor"
              language="yaml"
              v-model="oldTerms"
              v-show="showPlate.old"
              @keyup.ctrl.shift.v="testing(false)">
            </monaco-editor>
          </Col>
          <Col :xs="24" :sm="8">
            <div class="info" @click="showPlate.new = !showPlate.new">
              <span class="textarea-info" v-html="count.new"></span>
              <span class="textarea-title">更正数据</span>
            </div>
            <monaco-editor
              class="editor"
              language="yaml"
              v-model="newsTerms"
              v-show="showPlate.new"
              @keyup.ctrl.shift.v="testing(false)">
            </monaco-editor>
          </Col>
          <Col :xs="24" :sm="8">
            <div class="info" @click="showPlate.out = !showPlate.out">
              <span class="textarea-info" v-html="count.out"></span>
              <span class="textarea-title">转换内容</span>
            </div>
            <monaco-editor
              class="editor"
              language="yaml"
              v-model="outTerms"
              v-show="showPlate.out">
            </monaco-editor>
          </Col>
          <Col :xs="24" :sm="12">
            <div class="info" @click="showPlate.suc = !showPlate.suc">
              <span class="textarea-info" v-html="count.success"></span>
              <span class="textarea-title">成功信息</span>
            </div>
            <monaco-editor
              class="editor"
              language="yaml"
              v-model="successInfo"
              v-show="showPlate.suc">
            </monaco-editor>
          </Col>
          <Col :xs="24" :sm="12">
            <div class="info" @click="showPlate.err = !showPlate.err">
              <span class="textarea-info" v-html="count.error"></span>
              <span class="textarea-title">错误信息</span>
            </div>
            <monaco-editor
              class="editor"
              language="yaml"
              v-model="errorInfo"
              v-show="showPlate.err">
            </monaco-editor>
          </Col>
        </Row>
      </Card>

      <i-switch class="controls-switch" v-model="switchControl" @click="switchControl = !switchControl"></i-switch>

      <transition name="slide">
        <Card class="controls-btn" style="padding: 0 20%;" v-if="switchControl">
          <Row type="flex" justify="space-around" align="middle">
            <Button size="large" @click="testing(true)" v-if="!handleTermsWorker">开始处理</Button>
            <Button size="large" @click="proStartStatus" type="info" v-if="handleTermsWorker">运行线程</Button>
            <Tooltip content="转换内容编码后添加编码重数，便于调试" placement="top">
              <i-switch size="large" v-model="isDev">
                <span slot="open">重数</span>
                <span slot="close">重数</span>
              </i-switch>
            </Tooltip>
            <Tooltip content="填写测试信息至词库数据与更新数据中" placement="top">
              <Button size="large" @click="createDemo">测试内容</Button>
            </Tooltip>
            <Button size="large" type="error" @click="clearContent">清空内容</Button>
          </Row>
        </Card>
      </transition>

      <div class="bottom-info w-100">
        <Card>
          <Row type="flex" justify="center">
            <h3>申请表词库处理工具v{{version}}</h3>
          </Row>
        </Card>
        <Card>
          <Row type="flex" justify="center">
            <p>无法粘贴内容时，请使用<Badge class-name="key-dot" text="Ctrl"></Badge>+<Badge class-name="key-dot" text="Shift"></Badge>+<Badge class-name="key-dot" text="V"></Badge> 粘贴内容</p>
          </Row>
        </Card>
        <Card class="history-card">
          <h4 slot="title">更新历史</h4>
          <Button slot="extra" @click="updateAll = !updateAll">展开所有</Button>
          <Row>
            <Timeline>
              <TimelineItem>
                <Tag color="success">new</Tag>{{updateHistory[updateHistoryLength].ver}}: {{updateHistory[updateHistoryLength].cont}}
              </TimelineItem>
              <TimelineItem>
                <Tag>new</Tag>{{updateHistory[updateHistoryLength-1].ver}}: {{updateHistory[updateHistoryLength-1].cont}}
              </TimelineItem>
            </Timeline>
          </Row>
          <Row v-if="updateAll">
            <Timeline>
              <TimelineItem v-for="item in updateHistory" :key="item.cont">
                {{item.ver}}: {{item.cont}}
              </TimelineItem>
            </Timeline>
          </Row>
        </Card>
      </div>
    </Row>
  </Row>
</template>

<script>
import MonacoEditor from 'vue-monaco'
import { log } from 'util';
export default {
  components: {
    MonacoEditor
  },
  name: 'Contribution',
  data() {
    return {
      version: -1,
      oldTerms: '',
      newsTerms: '',
      oldAttr: '请输入词库数据\n词条\t编码',
      newAttr:
        '请输入更正数据\n编码\t[ +(添加) -(删除) *(修改) /(忽略) ]\t词条',
      btnInfo: '开始处理',
      outTerms: '',
      successInfo: '',
      errorInfo: '',
      oldTermsData: {},
      newsTermsData: {},
      newTermsData: '',
      newTermsCountData: {},
      successInfoData: '',
      count: {
        old: '词: 0 码: 0',
        new: '码: 0 符: 0 词: 0',
        out: '词: 0 码: 0',
        success: '共：0 加: 0 改: 0 删：0',
        error: '共: 0 错: 0 没：0 缺：0',
      },
      errorInfoData: '',
      demoData: {
        old: `剥壳	blke
经历	jglk
尽力	jglk
博客6	blke
万夫6	wffj
折子戏	fzxi
万付	wffj`,
        new: `cfoi	+	喰
swo	+	喰
jglk	*	尽了
blke	-	博客6
qkoio	+	喰`,
      },
      updates: false,
      isPhone: false,
      isDev: false,
      isLog: false,
      switchControl: true,
      showPlate: {
        old: true,
        new: true,
        out: true,
        suc: true,
        err: true,
      },
      updateAll: false,
      handleTermsWorker: null,
      updateHistory: [
        {
          ver: '1.0',
          cont: '正常使用，发布版本。',
        },
        {
          ver: '1.1',
          cont: '自动解决，全角半角问题。',
        },
        {
          ver: '1.2',
          cont: '新增*操作符，等同于!m，自动解决，全角半角问题。',
        },
        {
          ver: '1.3',
          cont: '使用*操作符作用主修改操作符，兼容!m修改符。',
        },
        {
          ver: '1.4',
          cont: '修复主动修改!m为*的步骤错误问题。',
        },
        {
          ver: '1.5',
          cont: '升级删除时确定编码词条才删除，改善提示内容。',
        },
        {
          ver: '1.6',
          cont: '升级添加细节优化处理。',
        },
        {
          ver: '1.6.1',
          cont: '改进成功信息提示时间。',
        },
        {
          ver: '1.7',
          cont:
            '新增查看编码所在行数，新增提示处理表的操作符 编码 词条的数量。',
        },
        {
          ver: '1.8',
          cont: '新增头部信息统计，改进自适应布局方式，完善缺失编码检测机制。',
        },
        {
          ver: '2.0',
          cont:
            '新增重码操作机制，以编码后缀方式操作词条序。较耗费性能，可关闭。',
        },
        {
          ver: '2.1',
          cont: '完善重码调试机制，可正常使用、完善移动端界面布局。',
        },
        {
          ver: '2.2',
          cont:
            '新增自动鉴别处理模式，无重码时操作更快，有重码自动转至重码模式。',
        },
        {
          ver: '2.3',
          cont: '纠正删除编码重码时的准确匹配，纠正Bug。',
        },
        {
          ver: '2.4',
          cont:
            '完成支持英文词库处理，前提每个英文词条中必须有至少一个大写字母。',
        },
        {
          ver: '2.5',
          cont: '完成检测词库数据中含有数字是否清除判断选项，避免误处理。',
        },
        {
          ver: '3.0',
          cont:
            '重码检测模式改进，使用#符号代替纯数字，不与词库中本有数字冲突。',
        },
        {
          ver: '4.0 Alpha',
          cont: '全局主题由Bootstrap迁移至iViewUI，优化重码处理速度。',
        },
        {
          ver: '4.0',
          cont: '重码算法优化，加入Web Worker后台线程计算。',
        },
        {
          ver: '4.1',
          cont:
            '阻止Chrome浏览器textarea的拼写检查。算法再次优化，允许用户结束处理线程。打印处理进度以1000词分隔，降低处理时的损耗时间。多处指示细节优化。',
        },
        {
          ver: '4.1.1',
          cont: '根据先辈指示，改进算法，大大提升处理速度。',
        },
        {
          ver: '4.1.2',
          cont: '优化操作符识别机制，存储识别逻辑清晰，新增忽略操作符 “/”。',
        },
        {
          ver: '4.1.2.1',
          cont: '纠正错误时提示，纠正各输入框中插入\'tab\'符的问题。',
        },
        {
          ver: '4.1.2.2',
          cont: '纠正原词库尾部没有换行时造成的生成词库没有换行问题。',
        },
        {
          ver: '4.2',
          cont: '更新：替换编辑器至 Monaco-Editor 若无法 Ctrl + V 粘贴内容，请使用 Ctrl + Shift + V 粘贴。望知晓',
        },
        {
          ver: '4.2.1',
          cont: '更新：请使用 Ctrl + Shift + V 粘贴。纠正：输出后自动排序、修改时的Bug、改进输出提示。',
        },
        {
          ver: '4.2.2',
          cont: '纠正：处理工具无白编号时默认#1，修改底部提示信息。',
        },
      ],
      updateHistoryLength: 0,
      showWarning: false
    };
  },
  created() {
    this.isPhoneFn();
    this.getVersion();
  },
  mounted() {
    this.Notice();
    this.createDemo();
    setTimeout(() => {
      this.testing(true);
    }, 1000);
    setTimeout(() => {
      this.msgCSV();
    }, 5000)
  },
  methods: {
    getVersion() {
      this.version = this.updateHistory[this.updateHistoryLength].ver;
    },
    handleOldTerms() {
      var thisData = {};

      thisData.old = this.oldTerms;
      thisData.oldArr = this.oldTerms.trim().split('\n');
      thisData.new = this.newTermsData;
      thisData.isLog = this.isLog;

      this.$Loading.start();
      this.$Message.destroy();
      this.$Message.loading({
        content: `启动转换进程：共有${
          this.oldTermsData.obj.word.length
        }，已开始处理，请稍后…`,
        duration: 0,
      });
      this.handleTermsPro &&
        this.$Message.loading({
          content: '已开启多条线程，为了更快速的处理，请关闭该标签页，重新打开。',
          duration: 0,
        });

      this.handleTermsWorker = null;
      //1 遍历旧词库,转换内容
      this.handleTermsWorker = this.$worker
        .run(
          ({oldArr, old}) => {
            let out = '';
            let dict = {};
            for (let it of oldArr) {
              it = it.trim();
              it = it.split(/\s+/);
              let c = it.pop().trim();
              dict[c] ? dict[c].push(it[0]) : (dict[c] = it);
            }
            for (let i in dict) {
              let idx = 1;
              while (dict[i].length) {
                out += `${i}#${idx}\t${dict[i].shift()}\n`;
                idx++;
              }
            }
            return out;
          },
          [thisData]
        )
        .then(res => {
          this.newTermsData = res;
          this.TermsCountSet('oldTerms', 'oldTermsData');
          this.handleTerms();
          this.handleTermsWorker = null;
        })
        .catch(e => {
          this.$Loading.error();
          this.$Message.destroy();
          this.$Message.error({
            content: `遇到错误：${e}`,
            duration: 0,
          });
          console.log(e);
          this.handleTermsWorker = null;
        });
    },
    handleTerms() {
      //设置公共属性
      var reg, out, log, searchStr, HaveCodeReg, TermsCorrectCodeReg;
      var thisNewData = this.newsTermsData.obj,
        x = 0,
        num = {
          suc: 0,
          errall: 0,
          add: 0,
          mod: 0,
          del: 0,
          err: 0,
          no: 0,
          erratt: 0,
        };

      //尾部添加换行避免错误
      this.newTermsData += '\r\n';
      //2 遍历新词条
      for (x in thisNewData.word) {
        //add
        if (thisNewData.opreation[x] == '+') {
          //判断编码是否已存在
          reg = new RegExp(`\\b${thisNewData.code[x]}#?\\d*\\b\\t.+`, 'g');
          log = `[ ${thisNewData.code[x]}\t${thisNewData.opreation[x]}\t${
            thisNewData.word[x]
          } ]`;
          out = `${thisNewData.code[x]}\t${thisNewData.word[x]}`;

          if (this.newTermsData.search(reg) == -1) {
            this.newTermsData += `${out}\r\n`;
            this.successInfoData += `Add: ${out}\t[第${+x + 1}行]\r\n`;
            num.suc++;
            num.add++;
          } else {
            this.errorInfoData += `[第${+x +
              1}行] \t${log}\r\n>> Error 编码已存在：\r\n${this.newTermsData
              .match(reg)
              .join('，')}\r\n\r\n`;
            num.errall++;
            num.err++;
          }
          //modify
        } else if (thisNewData.opreation[x] == '*') {
          reg = new RegExp(`\\b${thisNewData.code[x]}#?\\d*\\b\\t.+`);
          log = `[ ${thisNewData.code[x]}\t${thisNewData.opreation[x]}\t${
            thisNewData.word[x]
          } ]`;
          searchStr = this.newTermsData.match(reg);
          out = `${thisNewData.code[x]}\t${thisNewData.word[x]}`;

          if (this.newTermsData.search(reg) != -1) {
            this.newTermsData = this.newTermsData.replace(reg, `${out}`);
            this.successInfoData += `Mod: ${searchStr}\r\n  => ${out}\t[第${+x + 1}行]\r\n`;
            num.suc++;
            num.mod++;
          } else {
            this.errorInfoData += `[第${+x + 1}行]\t${log}\r\n>> Error 未找到编码：\r\n${
              thisNewData.code[x]
            }\r\n\r\n`;
            num.errall++;
            num.no++;
          }
          //delete
        } else if (thisNewData.opreation[x] == '-') {
          HaveCodeReg = new RegExp(
            `${thisNewData.code[x]}#?\\d*\\t.+[\\r\\n]*`,
            'g'
          );
          TermsCorrectCodeReg = new RegExp(
            `${thisNewData.code[x]}#?\\d*\\t${thisNewData.word[x]}[\\r\\n]*`
          );
          log = `[ ${thisNewData.code[x]}\t${thisNewData.opreation[x]}\t${
            thisNewData.word[x]
          } ]`;
          searchStr = this.newTermsData.match(TermsCorrectCodeReg);
          out = `${thisNewData.code[x]}\t${thisNewData.word[x]}`;

          if (this.newTermsData.search(HaveCodeReg) != -1) {
            if (this.newTermsData.search(TermsCorrectCodeReg) != -1) {
              this.newTermsData = this.newTermsData.replace(
                eval(TermsCorrectCodeReg),
                ''
              );
              this.successInfoData += `Del: { ${searchStr} } => ${out}\t[第${+x + 1}行]\r\n`;
              num.suc++;
              num.del++;
            } else {
              this.errorInfoData += `[第${+x +
                1}行]\t${log}\r\n>> Warn 词组编码不对应：\r\n${this.newTermsData
                .match(HaveCodeReg)
                .join('，')}\r\n\r\n`;
              num.errall++;
              num.no++;
            }
          } else {
            this.errorInfoData += `[第${+x +
              1}行]\t${log}\r\n>> Error 编码不存在：\r\n${
              thisNewData.code[x]
            }\r\n\r\n`;
            num.errall++;
            num.no++;
          }
          //忽略
        } else if (thisNewData.opreation[x] == '/') {
          log = `[ ${thisNewData.code[x]}\t${thisNewData.opreation[x]}\t${
            thisNewData.word[x]
          } ]`;
          out = `${thisNewData.code[x]}\t${thisNewData.word[x]}`;
          this.errorInfoData += `[第${+x +
            1}行]\t${log}\r\n>> Info 已忽略本次操作。\r\n${
            thisNewData.code[x]
          }\r\n\r\n`;
          num.errall++;
          num.erratt++;
        }
      }

      this.TermsCountSet('newTermsData', 'newTermsCountData');

      let nWordNum = this.newTermsCountData.obj.word.length,
        nCodeNum = this.newTermsCountData.obj.code.length;
      //填写底部统计
      this.count.out = `词: ${nWordNum} 码: ${nCodeNum}`;
      this.count.success = `共：${num.suc} 加: ${num.add} 改: ${num.mod} 删：${
        num.del
      }`;
      this.count.error = `共: ${num.errall} 错: ${num.err} 无：${num.no} 缺：${
        num.erratt
      }`;

      //填充内容
      if (this.isDev) {
        this.outTerms = this.clearIdent(true, this.newTermsData);
      } else {
        this.outTerms = this.clearIdent(false, this.newTermsData);
      }
      this.oldTerms = this.clearIdent(false, this.oldTerms);

      //扫描去除空行
      this.clearSpace('newTermsData');      

      //添加文档底部统计
      this.successInfoData = `成功统计：\n共有 ${num.suc} 个, 添加 ${
        num.add
      } 个,\n修改 ${num.mod} 个, 删除 ${num.del} 个。\n\n${
        this.successInfoData
      }`;
      if (!num.errall && !num.err && !num.no && !num.erratt) {
        this.errorInfoData = '恭喜，没有错误哦！';
      } else {
        this.errorInfoData = `失败统计：\n共有 ${num.errall} 个, 错误 ${
          num.err
        } 个,\n无踪 ${num.no} 个, 忽略 ${num.erratt} 个。\n\n${
          this.errorInfoData
        }`;
      }

      //排序输出内容
      this.sortExportsCont();

      //填写输出信息
      this.successInfo = this.successInfoData;
      this.errorInfo = this.errorInfoData;

      //发送成功信息
      this.$Message.destroy();
      this.$Message.success({
        content: `处理完毕！共成功${num.suc}个、失败${num.errall}个！`,
        duration: 3,
      });
      this.$Loading.finish();

      //清理数据
      this.successInfoData = this.errorInfoData = this.newTermsData = '';
      this.oldTermsData = {};
    },
    TermsCountSet(formName, formData) {
      //转换符号
      this.allToHalf();
      this.clearSpace(formName);

      this[formData].test = this[formName].split(/[\t\r\n]/g);

      this[formData].add = [];
      this[formData].obj = {};
      this[formData].obj.word = [];
      this[formData].obj.code = [];
      this[formData].obj.opreation = [];
      for (var x in this[formData].test) {
        var isOpreation = /^[+\-*/]$/.test(this[formData].test[x]);
        var isCode = /^[a-z]+#?\d*$/.test(this[formData].test[x]);
        var isChinese = /[^a-z]|[^+\-*]+/.test(this[formData].test[x]);
        if (isOpreation) {
          this[formData].obj.opreation.push(this[formData].test[x]);
        } else if (isCode) {
          this[formData].obj.code.push(this[formData].test[x]);
        } else if (isChinese) {
          this[formData].obj.word.push(this[formData].test[x]);
        }
      }
    },
    testing(isHoundle) {
      if (0 == this.oldTerms.length) {
        this.$Loading.error();
        this.$Message.error('工作表为空！');
        return;
      }

      //重置数据
      this.TermsCountSet('oldTerms', 'oldTermsData');
      this.TermsCountSet('newsTerms', 'newsTermsData');

      let oWordNum = this.oldTermsData.obj.word.length,
        oCodeNum = this.oldTermsData.obj.code.length,
        mWordNum = this.newsTermsData.obj.word.length,
        mModifyNum = this.newsTermsData.obj.opreation.length,
        mCodeNum = this.newsTermsData.obj.code.length;

      this.count.old = `词: ${oWordNum} 码: ${oCodeNum}`;
      this.count.new = `码: ${mCodeNum} 符: ${mModifyNum} 词: ${mWordNum}`;

      if (oWordNum != oCodeNum) {
        this.$Loading.error();
        this.$Message.error('请检查词库内容！');
        this.count.old = `<b style="color: red;">词: ${oWordNum} 码: ${oCodeNum}<b>`;
        return;
      }

      if (
        mWordNum != mModifyNum ||
        mModifyNum != mCodeNum ||
        mWordNum != mCodeNum
      ) {
        this.$Loading.error();
        this.$Message.error('请检查更正数据内容！');
        this.count.new = `<b style="color: red;">码: ${mCodeNum} 符: ${mModifyNum} 词: ${mWordNum}<b>`;
        return;
      }

      //正常则调用处理数据，否则仅计数，判断是否有错误内容
      if (isHoundle) {
        this.handleOldTerms();
      } else {
        return;
      }
    },
    sortExportsCont() {
      //排序
      var outCont = this.outTerms.split('\n');
      outCont = outCont.sort((a, b) => a.localeCompare(b));
      outCont = outCont.filter(val => {
        return val && val.trim();
      });
      
      this.outTerms = outCont.join('\r');
      this.clearSpace('outTerms');

      //逆向
      outCont = this.outTerms.split('\r');
      outCont = outCont.map(val => {
        let str = val.split('\t');
        return `${str[1]}\t${str[0].trim()}`;
      })
      this.outTerms = outCont.join('\r').replace('undefined\t', '');
    },
    createDemo() {
      this.oldTerms = this.demoData.old;
      this.newsTerms = this.demoData.new;
      this.testing(false);
    },
    proStartStatus() {
      this.$Message.error('处理线程运行中');
    },
    msgCSV() {
      this.$Message.success('请使用 Ctrl + Shift + V 粘贴内容');
    },
    clearContent() {
      this.oldTerms = this.newsTerms = this.outTerms = this.newTermsData = '';
      this.oldTermsData = {};
      this.testing(false);
      this.$Loading.finish();
      this.$Message.destroy();
      this.$Message.success('已清空数据');
    },
    allToHalf() {
      var regPlus = /＋/g;
      var regMinus = /-/g;
      var regModify = /!m|！m|！M|!M|＊/g;
      var regIgnore = /\/|／/g;
      this.newsTerms = this.newsTerms.replace(regPlus, '+');
      this.newsTerms = this.newsTerms.replace(regMinus, '-');
      this.newsTerms = this.newsTerms.replace(regModify, '*');
      this.newsTerms = this.newsTerms.replace(regIgnore, '/');
    },
    clearIdent(isclear, data) {
      var result = data.replace(/#\d+/g, '');
      return isclear ? data : result;
    },
    clearSpace(fromName) {
      this[fromName] = this[fromName].replace(/[\r\n]{2}/g, '\r\n');
    },
    clickHistory() {
      this.updates = !this.updates;
      this.isHover = !this.isHover;
    },
    insertTab() {
      document.execCommand('insertText', false, '	');
    },
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d + exdays * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + d.toGMTString();
      document.cookie = cname + '=' + cvalue + '; ' + expires;
    },
    getCookie(cname) {
      var name = cname + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return '';
    },
    Notice() {
      var isShowUpdate = this.getCookie('showUpdate');
      var newVer = parseFloat(this.updateHistory[this.updateHistoryLength].ver);

      if (isShowUpdate != newVer) {
        this.$Notice.open({
          title: '版本更新了',
          desc: `
              本次版本更新${this.updateHistory[this.updateHistoryLength].cont}
              版本号为${this.updateHistory[this.updateHistoryLength].ver}，
              详情请查阅底部说明。
            `,
          duration: 0,
          onClose: () => {
            this.setCookie('showUpdate', newVer, 3650);
          },
        });
      }
    },
    isPhoneFn() {
      if (document.documentElement.clientWidth <= 750) {
        this.isPhone = true;
      }
      if (!this.isPhone) {
        this.showPlate = {
          old: true,
          new: true,
          out: true,
          suc: true,
          err: true,
        };
      } else {
        this.switchControl = false;
      }
      for (let x in this.updateHistory) {
        this.updateHistoryLength = x;
      }
    },
  },
};
</script>

<style>
.main-container {
  border-radius: 0.25rem;
  overflow: hidden;
  z-index: 50;
}

.translateRotate-enter-active,
.translateRotate-leave-active {
  transition: all 0.5s;
}

.translateRotate-enter,
.translateRotate-leave-to {
  transform: translate3d(0, -10px, 10px) rotate3d(-2, 0, 0, -30deg);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s linear;
}

.slide-enter,
.slide-leave-to {
  height: 0;
  opacity: 0;
}

.editor {
  width: 100%;
  height: 200px;
}

.info {
  width: 100%;
  height: 0;
  overflow: hidden;
  text-align: left;
  border: 1px solid #e0e3da;
  padding-left: 5px;
  transition: all 0.3s;
  animation: info-animate 1s ease-in-out forwards;
}

.key-dot {
  margin: 0 3px;
  border-radius: 3px;
  background: #141414;
  background: -webkit-gradient(linear, left top, left bottom, from(#656565), to(#141414) );
  background: -moz-gradient(linear, left top, left bottom, from(#656565), to(#141414) );
  background: -o-gradient(linear, left top, left bottom, from(#656565), to(#141414) );
  filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr='#656565', EndColorStr='#141414');
}

@keyframes info-animate {
  form {
    height: 0;
    overflow: hidden;
  }

  to {
    height: 26px;
    overflow: auto;
  }
}

.textarea-info {
  float: right;
  opacity: 0.7;
  margin-right: 5px;
}

.controls-switch {
  position: fixed !important;
  left: 20px;
  bottom: 150px;
  z-index: 5;
}

.controls-btn {
  position: fixed !important;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.main-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.history-card .ivu-card-extra {
  top: 3px;
}

@media (min-width: 768px) {
  .controls-btn {
    position: static !important;
  }
  .controls-switch {
    display: none !important;
  }
}
</style>
