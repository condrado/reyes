<template>
  <div class="r-time-line__body" :style="{ width: `${widthLine}px` }">
    <div class="r-time-line__line">
      <div class="r-time-line__line-kings" v-html="lineKings"></div>
      <div class="r-time-line__line-decade" v-html="decadeMark"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TimeLine',

  data() {
    return {
      widthLine: 0,
      lineKings: '',
      decadeMark: '',
      yearIni: 1460,
      yearEnd: 2040,
      yearsTotal: 0,
      zoom: [1, 2, 5, 10],
      valueZoom: 15,
      paddingLine: 16,
      postionsFamilies: []
    }
  },
  mounted() {
    this.createWidthLine();
    this.createDecadeMarks();
    this.createLineKings();
  },
  methods: {
    createWidthLine() {
      this.yearsTotal = this.yearEnd - this.yearIni
      this.widthLine = ((this.yearsTotal * this.valueZoom) + (this.paddingLine * 2) - 1);
    },

    createDecadeMarks () {
      let classYear = '';
      if(this.valueZoom < 3) {
        classYear = 'vertical';
      }

      for (let index = 0; index < this.yearsTotal; index++) {
        if(( index % 10 ) == 0 || index === 0){
          this.decadeMark = this.decadeMark + '<div class="r-time-line__line-decade-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"><span>' + (index + this.yearIni) + '</span></div>';
        } else {
          if (index === this.yearsTotal - 1) {
            this.decadeMark = this.decadeMark + '<div class="r-time-line__line-years-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"><span style"left: calc((-34px / 2) + ' + (this.valueZoom - 1) + 'px) ;">' + (index + this.yearIni + 1) + '</span></div>';
          } else {
            this.decadeMark = this.decadeMark + '<div class="r-time-line__line-years-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"></div>';
          }
        }
      }
    },

    createLineKings () {
      const kings = this.$store.state.kings;
      let familyAux = '';
      let family = '';
      const levels = [];
      let levelsInt = 0;
      let levelsIntSec = 0;

      for (let j = 0; j < kings.length; j++) {
        const king = kings[j];
        
        if (familyAux === '') {
          levels[levelsInt] = king.level + 1;
        } else if (familyAux !== king.family) {
          levelsInt++;
          levels[levelsInt] = king.level + 1;
        }

        if (levels[levelsInt] < king.level) {
          levels[levelsInt] = king.level + 1;
        }

        familyAux =  king.family;
      }

      console.log(levels)

      for (let index = 0; index < kings.length; index++) {
        const king = kings[index];
        const positionInitYearKing = king.yearIni - this.yearIni

        if(king.yearEnd === 0) {
          const date = new Date();
          king.yearEnd = date.getFullYear();
        }

        if (family === '') {
          this.lineKings =  this.lineKings + '<div class="r-time-line__line-family" style="height: ' + ((levels[levelsIntSec] * 50) + 30) + 'px; z-index: ' + levelsIntSec + '"><p>' + king.family + '</p>';
        } else if (family !== king.family) {
          levelsIntSec++;
          this.lineKings =  this.lineKings + '</div><div class="r-time-line__line-family" style="height: ' + ((levels[levelsIntSec] * 50) + 30) + 'px; z-index: ' + levelsIntSec + '"><p>' + king.family + '</p>';
        }

        family =  king.family;

        this.lineKings = this.lineKings + '<div class="r-time-line__line-king" style="width: ' + this.valueZoom * ( king.yearEnd - king.yearIni) + 'px; left:' + (positionInitYearKing * this.valueZoom) + 'px; bottom: calc((50px * ' + king.level + ') + 16px);z-index:' + ((levels[levelsIntSec] - 1) - king.level) + '"><div class="r-time-line__line-card"><p>' + king.name + '</p><p style="display: none;">' + king.yearIni + '-' + king.yearEnd + '</p></div></div>'

        
      }
    }
  }
}
</script>

<style>
html {
  position: relative;
  white-space: nowrap;
  transition: all 0.2s;
  will-change: transform;
  user-select: none;
  cursor: pointer;
}

html.active {
  background: rgba(255,255,255,0.3);
  cursor: grabbing;
  cursor: -webkit-grabbing;
}

.r-time-line__body {
  height: calc(100vh - 56px);
  width: 5800px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 16px;
}

.r-time-line__line {
  height: 12px;
  width: 100%;
  outline: 1px solid #cccccc;
  display: block;
  position: relative;
  -webkit-box-shadow: 0px 0px 150px 0px rgba(0,0,0,1); 
  box-shadow: 0px 0px 150px 0px rgba(0,0,0,1);
  background-color: #FFFFFF;
}

.r-time-line__line::after {
  content: '';
  width: calc(100% - 12px);
  display: block;
  position: absolute;
  left: 6px;
  top: 4px;
}

.r-time-line__line-years {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
}

.r-time-line__line-years-mark {
  border-left: 1px solid #cccccc;
  height: 6px;
  margin-top: 3px;
  width: 1px;
  position: relative;
}

.r-time-line__line-decade {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
}

.r-time-line__line-decade-mark {
  border-left: 1px solid #cccccc;
  height: 16px;
  width: 1px;
  position: relative;
}

.r-time-line__line-decade-mark span {
  position: absolute;
  width: 34px;
  top: 20px;
  left: calc(-34px / 2);
  text-align: center;
}

.r-time-line__line-years-mark:first-child {
  border-left: 0;
}
.r-time-line__line-years-mark:last-child::before {
  content: '';
  border-right: 1px solid #cccccc;
  height: 16px;
  position: absolute;
  right: -1px;
  top: -3px;
}

.r-time-line__line-years-mark:last-child span {
  position: absolute;
  width: 34px;
  top: 17px;
  text-align: center;
}

.r-time-line__line-decade i:last-child {
  border-right: 1px solid #cccccc;
}

.r-time-line__line-decade-mark:first-child {
  margin-left: -1px;
}

.r-time-line__line-decade-mark.vertical span{
  top: 30px;
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.r-time-line__line-years-mark.vertical:last-child span{
  top: 27px;
  left: calc((-34px / 2) + 2px);
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.r-time-line__line-kings {
  position: absolute;
  bottom: 12px;
  width: 100%;
  overflow: hidden;
}

.r-time-line__line-family {
  position: relative;
  min-height: 70px;
}

.r-time-line__line-family > p {
  position: fixed;
}

.r-time-line__line-family:hover {
  background-color: aqua;
}

/* .r-time-line__line-family:hover .r-time-line__line-king {
  background-color: aqua;
} */

.r-time-line__line-king {
  position: absolute;
  background-color: #FFFFFF;
}

.r-time-line__line-king:hover::after {
  content: "";
  border-left: 1px dotted;
  border-right: 1px dotted;
  width: 100%;
  height: 600px;
  position: absolute;
  left: -1px;
  top: 0;
}

.r-time-line__line-card {
  height: 40px;
  outline: 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}


</style>
