<template>
    <div>
        <div class="r-form">
            <form class="r-form__form" action="">
            <label for="">
                Zoom
                <Range class="r-range" @update-range="updateRange"></Range>
            </label>

            <label for="">
                Año Inicio
                <input type="text" v-model="yearIniInput" @change="changeYearInit">
            </label>

            <label for="">
                Año Fin
                <input type="text" v-model="yearEndInput">
            </label>
            <label for="">
                Ver ancho pantalla
                <input type="checkbox" v-model="isFulllScreen" @change="changeFulllScree">
            </label>
        </form>
        </div>
        
        <template v-if="viewBody">
            <div class="r-body" v-dragscroll.x>
                <TimeLine :key="keyIndex"/>
            </div>
        </template>
    </div>

</template>

<script>
import TimeLine from './components/TimeLine.vue'
import Range from './components/Range'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    TimeLine,
    Range
  },
  data() {
    return {
      yearIniInput: '',
      yearEndInput: '',
      viewBody: true,
      keyIndex: 0,
      isFulllScreen: false
    }
  },
  methods: {
    ...mapActions({
        setYearIniInput: 'setYearIniInput',
        setYearEndInput: 'setYearEndInput',
        setWidthLine: 'setWidthLine',
        setRange: 'setRange',
        setIsFullScreen: 'setIsFullScreen'
    }),

    changeYearInit () {
        const parentScroll = document.querySelector('.r-body');
        const newYearIni = parseInt(this.yearIniInput)
        const newYearEnd = parseInt(this.yearIniInput)
        const yearIni = this.$store.state.yearIni;
        // const yearEnd = this.$store.state.yearEnd;
        const zoom = this.$store.state.range;

        if(newYearIni !== '') {
            this.setYearIniInput(newYearIni);
        }

        if(newYearEnd !== '') {
            this.setYearEndInput(newYearEnd);
        }

        parentScroll.scrollLeft = ((newYearIni - yearIni) * zoom) - 16;
        this.keyIndex++;
    },

    updateRange () {
      this.valueZoom = this.$store.state.range;
      this.keyIndex++;
    },

    changeFulllScree (e) {
        const yearIni = this.$store.state.yearIni;
        const yearEnd = this.$store.state.yearEnd;
        const zoom = ~~(document.body.clientWidth / (yearEnd - yearIni))
        const widthLine = (((yearEnd - yearIni) * zoom) + 32) - 1
console.log(document.body.clientWidth)
console.log((document.body.clientWidth ) / (yearEnd - yearIni))
console.log(yearEnd - yearIni)
console.log(document.body.clientWidth / (yearEnd - yearIni))
console.log('zoom: ', zoom)
console.log(widthLine)
        this.setIsFullScreen(e.target.checked);
        this.setWidthLine(widthLine);
        this.setRange(zoom)
        this.keyIndex++;
    }
  }
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
abbr, address, cite, code,
del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var,
b, i,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure,
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
    margin:0;
    padding:0;
    border:0;
    outline:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
}

body {
    line-height:1;
    min-height: 100vh;
    min-height: -webkit-fill-available;
}

article,aside,details,figcaption,figure,
footer,header,hgroup,menu,nav,section {
    display:block;
}

nav ul {
    list-style:none;
}

blockquote, q {
    quotes:none;
}

blockquote:before, blockquote:after,
q:before, q:after {
    content:'';
    content:none;
}

a {
    margin:0;
    padding:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
}

/* change colours to suit your needs */
ins {
    background-color:#ff9;
    color:#000;
    text-decoration:none;
}

/* change colours to suit your needs */
mark {
    background-color:#ff9;
    color:#000;
    font-style:italic;
    font-weight:bold;
}

del {
    text-decoration: line-through;
}

abbr[title], dfn[title] {
    border-bottom:1px dotted;
    cursor:help;
}

table {
    border-collapse:collapse;
    border-spacing:0;
}

/* change border colour to suit your needs */
hr {
    display:block;
    height:1px;
    border:0;  
    border-top:1px solid #cccccc;
    margin:1em 0;
    padding:0;
}

input, select {
    vertical-align:middle;
}

html {
  overflow-y: hidden;
  overflow-x: hidden;

}

.r-body {
    overflow-y: hidden;
    overflow-x: scroll;
    padding-bottom: 41px;
    /* mobile viewport bug fix */
    min-height: -webkit-fill-available;
    z-index: 0;
    position: relative;
}

.r-form {
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 16px;
  width: 100%;
  min-height: 80px;

  z-index: 2;
  background-color: #ffffff;

  &__form {
    margin: 24px 0 16px;
  }
}
</style>
