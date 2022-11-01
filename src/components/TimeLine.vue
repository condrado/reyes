<template>
  <div class="r-time-line__body" :style="{ width: `${widthLine}px` }">
    
    <div class="r-time-line__line">
      <div class="r-time-line__range" :style="{ width: `${widthLine}px` }">
        <div class="r-time-line__range-ini" :style="{ right: `${rangeIniPosition}px`, width: `${widthLine}px` }"></div>
        <div class="r-time-line__range-end"></div>
      </div>
      <div class="r-time-line__line-kings" v-html="lineKings"></div>
      <div class="r-time-line__line-decade" v-html="decadeMark"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TimeLine',
  data() {
    return {
      widthLine: this.$store.state.widthLine,
      lineKings: '',
      decadeMark: '',
      yearIni: this.$store.state.yearIni,
      yearEnd: this.$store.state.yearEnd,
      yearsTotal: 0,
      zoom: [1, 2, 5, 10],
      valueZoom: this.$store.state.range,
      paddingLine: 16,
      postionsFamilies: [],
      rangeIniPosition: 0,
      rangeEndPosition: 0,
    }
  },
  mounted() {
    this.createAll();
  },
  methods: {
    ...mapActions({
      setWidthLine: 'setWidthLine'
    }),

    createAll () {
      this.createWidthLine();
      this.createDecadeMarks();
      this.createLineKings();
      this.rangeCurtain();
    },

    createWidthLine() {
      this.yearsTotal = this.yearEnd - this.yearIni;

      if (!this.$store.state.isFullScreen) {
        this.widthLine = ((this.yearsTotal * this.valueZoom) + (this.paddingLine * 2) - 1);
      }

      console.log(this.widthLine)
      this.setWidthLine(this.widthLine);
    },

    createDecadeMarks () {
      let classYear = '';
      if(this.valueZoom < 4) {
        classYear = 'vertical';
      }

      for (let index = 0; index < this.yearsTotal; index++) {
        if(( index % 10 ) == 0 || index === 0){
          this.decadeMark = this.decadeMark + '<div class="r-time-line__line-marks r-time-line__line-decade-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"><span>' + (index + this.yearIni) + '</span></div>';
        } else {
          if (index === this.yearsTotal - 1) {
            this.decadeMark = this.decadeMark + '<div class="r-time-line__line-marks r-time-line__line-years-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"><span style"left: calc((-34px / 2) + ' + (this.valueZoom - 1) + 'px) ;">' + (index + this.yearIni + 1) + '</span></div>';
          } else {
            this.decadeMark = this.decadeMark + '<div class="r-time-line__line-marks r-time-line__line-years-mark ' + classYear + '" data-year="' + (index + this.yearIni) + '" data-id="' + (index + 1) + '" style="padding-right:' + (this.valueZoom - 1) + 'px"></div>';
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

      for (let index = 0; index < kings.length; index++) {
        const king = kings[index];
        const positionInitYearKing = king.yearIni - this.yearIni
        let widthReign = king.yearEnd - king.yearIni;
        let leftReign = 0;
        let cardSmall = '';
        let marginNameKing = 0

        if(king.yearEnd === 0) {
          const date = new Date();
          king.yearEnd = date.getFullYear();
        }

        if (family === '') {
          this.lineKings =  this.lineKings + '<div class="r-time-line__line-family" style="height: ' + ((levels[levelsIntSec] * 50) + 50) + 'px; z-index: ' + levelsIntSec + '"><p>' + king.family + '</p>';
        } else if (family !== king.family) {
          levelsIntSec++;
          this.lineKings =  this.lineKings + '</div><div class="r-time-line__line-family" style="height: ' + ((levels[levelsIntSec] * 50) + 50) + 'px; z-index: ' + levelsIntSec + '"><p>' + king.family + '</p>';
        }

        family =  king.family;

        if (widthReign === 0) {
          widthReign = this.valueZoom * 0.5;
          leftReign = positionInitYearKing * this.valueZoom - (widthReign / 2);
          cardSmall = 'cardSmall';
          marginNameKing = widthReign + 8;
        } else if (widthReign < 5) {
          widthReign = this.valueZoom * widthReign;
          leftReign = positionInitYearKing * this.valueZoom
          cardSmall = 'cardSmall';
          marginNameKing = widthReign + 8;
        } else {
          widthReign = this.valueZoom * widthReign;
          leftReign = positionInitYearKing * this.valueZoom
        }

        let nameKing = document.createElement('p')
        nameKing.innerText = king.name;


        this.lineKings = this.lineKings + '<div class="r-time-line__line-king" style="width: ' + widthReign + 'px;' +
                                                                                      'left:' + leftReign + 'px;' +
                                                                                      'bottom: calc((50px * ' + king.level + ') + 16px);' +
                                                                                      'z-index:' + ((levels[levelsIntSec] - 1) - king.level) + '">' +
                                            '<div class="r-time-line__line-card ' + cardSmall + '">' +
                                              '<p style="margin-left: ' + marginNameKing + 'px">' + king.name + '</p>' +
                                              '<p style="display: none;">' + king.yearIni + '-' + king.yearEnd + '</p>' +
                                            '</div>' +
                                          '</div>'
      }
    },

    rangeCurtain () {
      const yearIniInput = this.$store.state.yearIniInput;
      // const yearEndInput = this.$store.state.yearEndInput;

      if (yearIniInput) {
        this.rangeIniPosition = this.widthLine - ((yearIniInput - this.yearIni) * this.valueZoom);
      } else {
        this.rangeIniPosition = this.widthLine + 16;
      }
      
    },

    removeAll() {
      const families = document.querySelectorAll('.r-time-line__line-family');
      const years = document.querySelectorAll('.r-time-line__line-marks');

      for (let i = 0; i < families.length; i++) {
       families[i].remove();
      }

      for (let j = 0; j < years.length; j++) {
        years[j].remove();
      }

      this.lineKings = '';
      this.decadeMark = '';
    },
  }
}
</script>

<style lang="scss">
.r-time-line__body {
  height: calc(100vh - 56px);
  width: 5800px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 16px;
}

.r-time-line__line {
  height: inherit;
  width: 100%;
  // outline: 1px solid #cccccc;
  display: block;
  position: relative;
  // -webkit-box-shadow: 0px 0px 150px 0px rgba(0,0,0,1); 
  // box-shadow: 0px 0px 150px 0px rgba(0,0,0,1);
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
  bottom: 0;
  z-index: 1;
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
  z-index: 3;
}

.r-time-line__line-family {
  position: relative;
  min-height: 70px;
  border-top: 1px dotted #cccccc;
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
  position: relative;
  width: inherit;

  p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: inherit;
  }

  &.cardSmall {
    align-items: flex-start;

    p {
      text-align: left;
      margin-left: 8px;
      overflow: visible;
    }
  }
}



.r-range {

}

.r-time-line__range {
  height: 100vh;
  position: absolute;
  z-index: 3;

  &-ini,
  &-end {
    background-color: #000000;
    height: 100vh;
    opacity: .4;
    position: absolute;
  }

  &-ini {
  
  }

  &-end {

  }
}


</style>
