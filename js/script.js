let menuBtn = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .flex .navbar');

menuBtn.onclick = () =>{
   menuBtn.classList.toggle('fa-times');
   navbar.classList.toggle('active');
}

window.onscroll = () =>{
   menuBtn.classList.remove('fa-times');
   navbar.classList.remove('active');
}

var typed = new Typed(".script_write", {
  strings: ["", "MCC"],
  typeSpeed: 200,
  backSpeed: 300,
  loop: true
});

var swiper = new Swiper(".course-slider", {
   spaceBetween: 20,
   grabCursor:true,
   loop:true,
   pagination: {
     el: ".swiper-pagination",
     clickable: true,
   },
   breakpoints: {
      540: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
   },
});

var swiper = new Swiper(".teachers-slider", {
   spaceBetween: 20,
   grabCursor:true,
   loop:true,
   pagination: {
     el: ".swiper-pagination",
     clickable: true,
   },
   breakpoints: {
      540: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
   },
});

var swiper = new Swiper(".reviews-slider", {
   spaceBetween: 20,
   grabCursor:true,
   loop:true,
   pagination: {
     el: ".swiper-pagination",
     clickable: true,
   },
   breakpoints: {
      540: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
   },
});
/*VUE ADMIN*/

Vue.component('aggiungidocenteform',{
    data: function(){
        return {
            nome:'',
            cognome:'',
            aggiungiDocenteServlet: 'aggiungiDocenteServlet',
        };
    },
    template: '<form onsubmit="return false; class="myforms" " > <div class="row"> <div class="col"> <input id="nomeDocente"  onkeydown="return /[a-z]/i.test(event.key)" type="text" class="form-control" placeholder="Nome" > </div> <div class="col"> <input id="cognomeDocente" onkeydown="return /[a-z]/i.test(event.key)" type="text" class="form-control" placeholder="Cognome"> </div> </div> <button id="buttonAggiungiDoc" class="btn btn-primary" type="submit" v-on:click="aggiungiDocenti" >Aggiungi</button><button  class="btn btn-primary" type="submit" v-on:click="annaggiungiDocenti" >Annulla</button></form>',
    methods:{
        aggiungiDocenti: function(){
            var self = this;
            self.nome =$('#nomeDocente').val();
            self.cognome =$('#cognomeDocente').val();
            if(self.nome==='' && self.cognome ==='' ){
                alert('Per favore inserisci un nome e un cognome valido');
            }else if(self.cognome===''){
                alert('Per favore inserisci un cognome valido');
            }
            else if((self.nome==='')) {
                alert('Per favore inserisci un nome valido');
            }else{
                $.ajax({
                    type: "POST",
                    url: this.aggiungiDocenteServlet,
                    data: "{\"nome\":\"" + self.nome + "\",\"cognome\":\"" + self.cognome + "\"}",
                    contentType: 'application/json',
                    dataType: 'json',
                });
                this.$emit('transit-inner-restore');
            }
        },
        annaggiungiDocenti: function(){
            this.$emit('transit-inner-restore');
        }
    }

})

Vue.component('aggcorsodocente', {
    data: function(){
        return {
            listaDocenti: [],
            listaCorsi: [],
            id_corso: '',
            id_docente: '',
            altreInfo: '',
            getListaDocentiServlet: 'listaDocentiServlet',
            getListaCorsiServlet: 'listaCorsiServlet',
            listaCDIsRendered: false,
            aggiungiCorsoDocenteServlet: 'aggiungiCorsoDocenteServlet',
            listaCorsoDocenteIsVuota: false
        };
    },
    template: '<div v-if="listaCorsoDocenteIsVuota"><p><strong>Nessun corso e/o docente disponibile</strong></p> <button  class="btn btn-primary" type="submit" v-on:click="annaggCorsoDocente" >Annulla</button></div><div v-else ><form class="myforms" onsubmit="return false;" > <div class="row"><select id="corsoSelect"  class="form-select" aria-label="Default select example">\n' +
        '  <option v-for="corso in listaCorsi"  :value="corso.id">{{corso.nomeCorso}} {{corso.date}} {{corso.orario}}</option>\n' +
        '</select><select  id="docenteSelect" class="form-select" aria-label="Default select example">\n' +
        '  <option v-for="docente in listaDocenti" :value="docente.id_docente">{{docente.nome}} {{docente.cognome}}</option>\n' +
        '</select></div> <button  class="btn btn-primary" type="submit" v-on:click="aggCorsoDocente" >Aggiungi</button><button  class="btn btn-primary" type="submit" v-on:click="annaggCorsoDocente" >Annulla</button></form></div>',
    mounted(){
        this.getListaCorsi();
        this.getListaDocenti();
        // setTimeout(() => this.listaCDIsRendered = true, 70);

        setTimeout(() =>  this.dest(), 70);
    },

    methods: {
        dest: function () {
            if (this.listaCorsi.length === 0 || this.listaDocenti.length === 0) {
                this.listaCorsoDocenteIsVuota = true;
            }
        },
        getListaCorsi: function () {
            var self = this;
            $.get(this.getListaCorsiServlet, function (data) {
                self.listaCorsi = data;
            });
        },
        annaggCorsoDocente: function () {
            this.toggllel();
        },

        getListaDocenti: function () {
            var self = this;
            $.get(this.getListaDocentiServlet, function (data) {
                self.listaDocenti = data;
            });
        },
        aggCorsoDocente: function () {
            var self = this;
            self.id_corso = $("#corsoSelect :selected").val();
            self.id_docente = $("#docenteSelect :selected").val();
            $.post(this.aggiungiCorsoDocenteServlet, "{\"id_corso\":\"" + self.id_corso + "\", \"id_docente\":\"" + self.id_docente + "\"}",
                function (data) {
                    self.altreInfo = data;
                });

            setTimeout(() => this.popupp(), 140);

        },
        popupp: function () {
            if (this.altreInfo.resulte === "success") {
                this.toggllel();

            } else if (this.altreInfo.resulte === 'erroreExist') {
                alert('Relazione corsodocente già esistente. Riprova.');
            }
            else if (this.altreInfo.resulte === 'notDisponible') {
                alert('Docente non disponibile nella fascia oraria selezionata oppure relazione già esistente. Riprova.');
            }
        },
        toggllel: function () {
            this.$emit('transit-inner-restor');
        }
    }

})

Vue.component('corsiform', {
    data: function(){
        return {
            nome:'',
            orario:'',
            date:'',
            altreInfo:'',
            resp: {},
            aggiungiCorsoServlet: 'aggiungiCorsoServlet',
        };
    },
    template: '<form onsubmit="return false;" class="myforms" > <div class="row"> <div class="col"> <input id="nomeCorso" onkeydown="return /[a-z]/i.test(event.key)" type="text" class="form-control" placeholder="Nome corso"> </div> <select  id="dateSelect" class="form-select" aria-label="Default select example">\n' +
        '  <option selected value="Luned">Lunedì</option>\n' +
        '  <option value="Marted">Martedì</option>\n' +
        '  <option value="Mercoled">Mercoledì</option>\n' +
        '  <option value="Gioved">Giovedì</option>\n' +
        '  <option value="Venerd">Venerdì</option>\n' +
        '</select><select id="selectOrario" class="form-select" aria-label="Default select example">\n' +
        '  <option selected value="1">15:00-16:00</option>\n' +
        '  <option value="2">16:00-17:00</option>\n' +
        '  <option value="3">17:00-18:00</option>\n' +
        '  <option value="4">18:00-19:00</option>\n' +
        '</select></div> <button id="buttonAggiungiCorr" class="btn btn-primary" type="submit" v-on:click="aggiungiCorso" >Aggiungi</button><button class="btn btn-primary" type="submit" v-on:click="toggllel" >Annulla</button></form>',
    methods: {
        aggiungiCorso: function () {
            var self = this;
            self.nome = $('#nomeCorso').val();
            self.orario = $("#selectOrario :selected").text();
            self.date = $("#dateSelect :selected").val();
            $.post(this.aggiungiCorsoServlet, "{\"nomecorso\":\"" + self.nome + "\",\"date\":\"" + self.date + "\", \"orario\":\"" + self.orario +"\"}",
                function (data) {
                    self.altreInfo = data;
                });
            setTimeout(() => this.popupp(), 100);
        },
        popupp: function(){
            if(this.altreInfo.resulte ==="success"){
                this.toggllel();

            }else if(this.altreInfo.resulte==='erroreExist'){
                alert('Slot già occupato. Riprova.');
            }
        },
        toggllel: function (){
            this.$emit('transit-inner-restore');
        }


    }

})

Vue.component('corsirender',{
    inject : ['listaCorsi'],
    data: function(){
        return {
            selectedCorsi: [],
            JSONselectedCorsi: "",
            link: 'listaCorsiServlet',
            linkRimuoviCorso: 'rimuoviCorsoServlet',
            listaCorsiIsRendered: false,
            listaCorsiIsVuota: false,
            gogo: []
        };
    },

    template:'<div v-if="listaCorsiIsVuota"><p><strong>Nessun corso disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorso" >Aggiungi corso</button></div><div v-else-if="listaCorsiIsRendered">' +
        '<table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome</th>\n' +
        '      <th scope="col" class="text-white">Data</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="corso in listaCorsi">\n' +
        '    <tr>\n' +
        '      <td><input type="checkbox" name="listaCorsiCheckBox" :value="corso.id"></td>\n' +
        '      <td class="text-white">{{corso.nomeCorso}}</td>\n' +
        '      <td class="text-white">{{corso.date}}</td>\n' +
        '      <td class="text-white">{{corso.orario}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table> ' +
        '<div><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorso" >Aggiungi corso</button><button  class="btn btn-primary" type="submit" v-on:click="rimuoviCorsiHandler" >Rimuovi</button></div></div>',

    mounted(){
        this.getListaCorsi();
    },
    methods: {
        dest: function(){
            if(this.listaCorsi.length ===0){
                setTimeout(() => this.listaCorsiIsVuota = true, 70);
            }else{setTimeout(() => this.listaCorsiIsRendered = true, 70);}
        },
        getListaCorsi: function () {
            var self = this;
            $.get(this.link, function (data) {
                self.listaCorsi = data;
            });
            setTimeout(() => this.dest(), 170);


        },
        rimuoviCorsiHandler: function(){
            let checkboxes = document.querySelectorAll('input[name="listaCorsiCheckBox"]:checked');

            if(checkboxes.length === 0) {
                alert('Per favore seleziona almeno un corso da rimuovere.')
            }else{
                this.rimuoviCorso();
            }
        },
        rimuoviCorso: function(){
            var self = this;
            self.selectedCorsi= $('input[name="listaCorsiCheckBox"]:checked').map(function() {
                return $(this).val();
            }).get();

            let x = self.selectedCorsi.length;

            self.JSONselectedCorsi = '{ index: '+ '\"'+x+'\" ,\n';
            for(let i=0; i<x; i++){
                self.JSONselectedCorsi = self.JSONselectedCorsi + 'id_'+ i + ' : \"' + self.selectedCorsi.pop() + '\",\n';
            }
            self.JSONselectedCorsi = self.JSONselectedCorsi + 'indasx: '+ '\"'+x+'\" }';
            // self.JSONselectedDocenti = JSON.stringify(self.JSONselectedDocenti);
            //$.post(this.linkRimuoviDocenti, self.JSONselectedDocenti);
            this.rimuoviCor();

        },
        aggiungiCorso: function(){
            this.$emit('transit-inner-form-corsi');
        },
        rimuoviCor: function(){
            $.ajax({
                type: "POST",
                url:this.linkRimuoviCorso,
                data:this.JSONselectedCorsi,
                contentType: 'application/json',
                dataType: 'json'
            });
            this.getListaCorsi();
            this.transiInnerR();
        },
        transiInnerR: function() {
            this.$emit('transit-inner-corsi');
        }

    }

})
Vue.component ('ripetizionirender', {
    inject : ['listaRipetizioni', 'isVisibileRipetizioni'],
    data: function(){
        return {
            selectedRipetizioni: [],
            JSONselectedRipetizioni: "",
            link: 'listaRipetizioniServlet',
            linkRimuoviCorsoDocente: 'rimuoviCorsoDocenteServlet',
            listaRipetizioniIsRendered: false,
            listaRipetizioniIsVuota: false
        };
    },
    template:'<div v-if="listaRipetizioniIsVuota"><p><strong>Nessuna ripetizione disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorsoDocente" >Aggiungi relazione corsodocente</button></div><div v-else-if="listaRipetizioniIsRendered" ><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="corsodocente in listaRipetizioni">\n' +
        '    <tr>\n' +
        '      <td><input type="checkbox" name="listaRipetizioniCheckBox" :value="corsodocente.id"></td>\n' +
        '      <td class="text-white">{{corsodocente.nomeCorso}}</td>\n' +
        '      <td class="text-white">{{corsodocente.nome}} {{corsodocente.cognome}}</td>\n' +
        '      <td class="text-white">{{corsodocente.date}}</td>\n' +
        '      <td class="text-white">{{corsodocente.orario}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><div><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorsoDocente" >Aggiungi relazione corsodocente</button><button  class="btn btn-primary" type="submit" v-on:click="rimuoviRipetizioniHandler" >Rimuovi</button></div></div>\n',


    //
    //     '<div v-if="listaRipetizioniIsVuota"><p><strong>Nessuna ripetizione disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorsoDocente" >Aggiungi relazione corsodocente</button></div><div v-else-if="listaRipetizioniIsRendered"><label v-for="corsodocente in listaRipetizioni" class="list-group-item">' +
    // '    <div><input name="listaRipetizioniCheckBox"class="form-check-input me-1" type="checkbox" :value="corsodocente.id"> {{corsodocente.nomeCorso}} ( {{corsodocente.date}} {{corsodocente.orario}} ) sostenuto da {{corsodocente.nome}} {{corsodocente.cognome}}</div></label> <div v-if="listaRipetizioniIsRendered"><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorsoDocente" >Aggiungi relazione corsodocente</button><button  class="btn btn-primary" type="submit" v-on:click="rimuoviRipetizioniHandler" >Rimuovi</button></div></div>',

    mounted(){
        this.getListaRipetizioni();
        setTimeout(() => this.listaRipetizioniIsRendered = true, 70);
    },
    methods: {
        dest: function(){
            if(this.listaRipetizioni.length ===0){
                this.listaRipetizioniIsVuota = true;
            }else{ this.listaRipetizioniIsRendered = true;}
        },

        rimuoviRipetizioniHandler: function(){
            let checkboxes = document.querySelectorAll('input[name="listaRipetizioniCheckBox"]:checked');

            if(checkboxes.length === 0) {
                alert('Per favore seleziona almeno una ripetizione da rimuovere.')
            }else{
                this.rimuoviCorsoDocente();
            }
        },
        getListaRipetizioni: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaRipetizioni = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 40);
        },
        aggiungiCorsoDocente: function(){
            this.$emit('transit-inner-form-corsodocente');
        },
        rimuoviCorsoDocente: function(){
            var self = this;
            self.selectedRipetizioni= $('input[name="listaRipetizioniCheckBox"]:checked').map(function() {
                return $(this).val();
            }).get();

            let x = self.selectedRipetizioni.length;

            self.JSONselectedRipetizioni = '{ index: '+ '\"'+x+'\" ,\n';
            for(let i=0; i<x; i++){
                self.JSONselectedRipetizioni = self.JSONselectedRipetizioni + 'id_'+ i + ' : \"' + self.selectedRipetizioni.pop() + '\",\n';
            }
            self.JSONselectedRipetizioni = self.JSONselectedRipetizioni + 'indasx: '+ '\"'+x+'\" }';
            // self.JSONselectedDocenti = JSON.stringify(self.JSONselectedDocenti);
            //$.post(this.linkRimuoviDocenti, self.JSONselectedDocenti);
            this.rimuoviDoce();
            this.getListaRipetizioni();
        },
        rimuoviDoce: function (){
            $.ajax({
                type: "POST",
                url:this.linkRimuoviCorsoDocente,
                data:this.JSONselectedRipetizioni,
                contentType: 'application/json',
                dataType: 'json'
            });
            this.listaRipetizioniIsRendered = false;
            this.transiInnerR();
        },
        transiInnerR: function() {
            this.$emit('transit-inner-ripetizioni');
        }


    }
})
Vue.component ('docentirender',{
    inject : ['terzaPagina'],
    data: function() {
        return {
            listaDocenti:[],
            listaDocentiIsRendered: false,
            listaRender: true,
            renderKey: 0,
            messagee: 'waa',
            link: 'listaDocentiServlet',
            linkRimuoviDocenti: 'rimuoviDocentiServlet',
            selectedDocenti: [],
            JSONselectedDocenti: "",
            listaDocentiIsVuota: false
        };
    },
    template: '<div v-if="listaDocentiIsVuota"><p><strong>Nessun docente disponibile</strong></p><button id="buttonAggiungiDocenti" class="btn btn-primary" type="submit" v-on:click="mostraForm" >Aggiungi docente</button></div><div v-else>' +
        '<table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome</th>\n' +
        '      <th scope="col" class="text-white">Cognome</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="docente in listaDocenti">\n' +
        '    <tr>\n' +
        '      <td><input type="checkbox" name="listaDocentiCheckBox" :value="docente.id_docente"></td>\n' +
        '      <td class="text-white">{{docente.nome}}</td>\n' +
        '      <td class="text-white">{{docente.cognome}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><div id="buttonsAdminPage"><button class="btn btn-primary" type="submit" v-on:click="mostraForm" >Aggiungi docente</button><button id="buttonRimuoviDocenti" class="btn btn-primary" type="submit" v-on:click="rimuoviDocentiHandler" >Rimuovi</button></div></div>' ,
    // template:'<div v-if="listaDocentiIsVuota"><p><strong>Nessun docente disponibile</strong></p><button id="buttonAggiungiDocenti" class="btn btn-primary" type="submit" v-on:click="mostraForm" >Aggiungi docente</button></div><div v-else><label v-for="docente in listaDocenti" class="list-group-item">' +
    // '    <input name="listaDocentiCheckBox" class="form-check-input me-1" type="checkbox" :value="docente.id_docente"> {{docente.nome}} {{docente.cognome}}</label> <div id="buttonsAdminPage" v-if="listaDocentiIsRendered"><button id="buttonAggiungiDocenti" class="btn btn-primary" type="submit" v-on:click="mostraForm" >Aggiungi docente</button><button id="buttonRimuoviDocenti" class="btn btn-primary" type="submit" v-on:click="rimuoviDocentiHandler" >Rimuovi</button></div></div>',

    //mounted è una funzione che viene invocata quanto la componente è pronta
    mounted(){
        this.getListaDocenti();
        setTimeout(() => this.listaDocentiIsRendered = true, 20);

    },
    methods:{

        dest: function(){
            if(this.listaDocenti.length ===0){
                setTimeout(() => this.listaDocentiIsVuota = true, 10);
            }else{setTimeout(() => this.listaDocentiIsRendered = true, 10);}
        },

        rimuoviDocentiHandler: function(){
            let checkboxes = document.querySelectorAll('input[name="listaDocentiCheckBox"]:checked');

            if(checkboxes.length === 0) {
                alert('Per favore seleziona almeno un docente da rimuovere.')
            }else{
                this.rimuoviDocenti();
            }
        },
        getListaDocenti: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaDocenti = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 70);
        },
        mostraForm: function(){
            this.$emit('transit-inner-form');
        },
        rimuoviDocenti: function(){

            var self = this;
            self.selectedDocenti= $('input[name="listaDocentiCheckBox"]:checked').map(function() {
                return $(this).val();
            }).get();

            let x = self.selectedDocenti.length;

            self.JSONselectedDocenti = '{ index: '+ '\"'+x+'\" ,\n';
            for(let i=0; i<x; i++){
                self.JSONselectedDocenti = self.JSONselectedDocenti + 'docente_'+ i + ' : \"' + self.selectedDocenti.pop() + '\",\n';
            }
            self.JSONselectedDocenti = self.JSONselectedDocenti + 'indasx: '+ '\"'+x+'\" }';
            // self.JSONselectedDocenti = JSON.stringify(self.JSONselectedDocenti);
            //$.post(this.linkRimuoviDocenti, self.JSONselectedDocenti);
            this.rimuoviDoce();
            this.getListaDocenti();
        },
        rimuoviDoce: function (){
            $.ajax({
                type: "POST",
                url:this.linkRimuoviDocenti,
                data:this.JSONselectedDocenti,
                contentType: 'application/json',
                dataType: 'json'
            });
            this.transiInnerR();
        },
        transiInnerR: function() {
            this.$emit('transit-inner');
        }
    }
})
Vue.component('storicorender',{
    data: function() {
        return {
            listaStorico: [],
            listaStoricoIsRendered: false,
            link: 'listaStoricoAllServlet',
            listaStoricoIsVuota: false
        };
    },
    created() {
        this.$root.$refs.listastoricorender = this;
    },
    template:
        '<div><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Username</th>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '      <th scope="col" class="text-white">Stato attività</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="prenotazione in listaStorico">\n' +
        '    <tr>\n' +
        '      <td class="text-white">{{prenotazione.username}}</td>\n' +
        '      <td class="text-white">{{prenotazione.nomecorso}}</td>\n' +
        '      <td class="text-white">{{prenotazione.nome}} {{prenotazione.cognome}}</td>\n' +
        '      <td class="text-white">{{prenotazione.data}}</td>\n' +
        '      <td class="text-white">{{prenotazione.orario}}</td>\n' +
        '      <td class="text-white">{{prenotazione.stato}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><button class="btn btn-primary" type="submit" v-on:click="getListaStorico" >Aggiorna</button></div>'
    ,
    mounted(){
        this.getListaStorico();
    },
    methods: {
        getListaStorico: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaStorico = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
        },

    }

})
/*VUE UTENTE*/
Vue.component ('listaripetizionirender', {
    inject: ['username'],
    data: function(){
        return {
            listaripetizioniKey: 0,
            listaRipetizioni: [],
            selectedRipetizioni: [],
            JSONselectedRipetizioni: "",
            link: 'listaPrenotaRipetizioniWebServlet',
            prenotaServlet: 'prenotaRipetizioniWebServlet',
            listaRipetizioniIsRendered: false,
            listaRipetizioniIsVuota: false,
            user: this.username
        };
    },
    created() {
        this.$root.$refs.listaripetizionirender = this;
    },
    template:'<div v-if="listaRipetizioniIsVuota"><p><strong>Nessuna ripetizione disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="getListaRipetizioni" >Aggiorna</button></div> <div v-else-if="listaRipetizioniIsRendered" ><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="corsodocente in listaRipetizioni">\n' +
        '    <tr>\n' +
        '      <td><input type="radio" name="radioRipetizioni" :value="corsodocente.id"></td>\n' +
        '      <td class="text-white">{{corsodocente.nomeCorso}}</td>\n' +
        '      <td class="text-white">{{corsodocente.nome}} {{corsodocente.cognome}}</td>\n' +
        '      <td class="text-white">{{corsodocente.date}}</td>\n' +
        '      <td class="text-white">{{corsodocente.orario}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><button class="btn btn-primary" type="submit" v-on:click="prenotaRipetizioniHandler" >Prenota</button> </div>\n',
    mounted(){
        this.getListaRipetizioni();
        setTimeout(() => this.listaRipetizioniIsRendered = true, 70);
    },
    methods: {
        dest: function(){
            if(this.listaRipetizioni.length ===0){
                this.listaRipetizioniIsVuota = true;
            }else{ this.listaRipetizioniIsRendered = true;
                this.listaRipetizioniIsVuota = false;}
        },

        prenotaRipetizioniHandler: function(){
            let checkboxes =document.querySelector('input[name="radioRipetizioni"]:checked');

            if(checkboxes.length === 0) {
                alert('Per favore seleziona almeno una ripetizione da prenotare.')
            }else{
                this.prenotaRipetizioni();
            }
        },
        getListaRipetizioni: function(){
              var self = this;
            $.get(this.link, function(data) {
                self.listaRipetizioni = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 100);
        },
        prenotaRipetizioni: function(){
            var self = this;
            self.selectedRipetizioni= document.querySelector("input[type='radio'][name='radioRipetizioni']:checked").value;

            self.JSONselectedRipetizioni = '{ id: \"'+self.selectedRipetizioni+'\" }';
            this.prenotaRip();
        },
        prenotaRip: function (){
            $.ajax({
                type: "POST",
                url:this.prenotaServlet,
                data:this.JSONselectedRipetizioni,
                contentType: 'application/json',
                dataType: 'json',
                    success: function (data) {
                        if (data.resulte === "errore") {
                            alert('Ripetizione già prenotata da un altro utente');
                        }else if(data.resulte === "erroreorario"){
                            alert('Non puoi prenotare più ripetizioni nella stessa fascia oraria');
                        }

                    }
            }
            );
            setTimeout(() => this.$root.$refs.listaprenotazionirender.getListaPrenotazioni(), 40);
            setTimeout(() => this.$root.$refs.listastoricorender.getListaStorico(), 40);
            setTimeout(() => this.getListaRipetizioni(), 40);

        }


    }
})
Vue.component ('listaprenotazionirender',{
    inject: ['username'],
    data: function(){
        return {
            listaPrenotazioni: [],
            listaPrenotazioniIsRendered: false,
            getPrenotazioniServlet: 'listaPrenotazioniWebServlet',
            selectedPrenotazioni: "",
            JSONselectedPrenotazioni:"",
            listaPrenotazioniIsVuota: false
        }
    },
    created() {
        this.$root.$refs.listaprenotazionirender = this;
    },
    template:'' +
        '<div v-if="listaPrenotazioniIsVuota"><p><strong>Nessuna ripetizione disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="getListaPrenotazioni" >Aggiorna</button></div> <div v-else-if="listaPrenotazioniIsRendered" ><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '      <th scope="col" class="text-white">Stato attività</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="prenotazione in listaPrenotazioni">\n' +
        '    <tr>\n' +
        '      <td><input type="radio" name="radioPrenotazioni" :value="prenotazione.id"></td>\n' +
        '      <td class="text-white">{{prenotazione.nomecorso}}</td>\n' +
        '      <td class="text-white">{{prenotazione.nome}} {{prenotazione.cognome}}</td>\n' +
        '      <td class="text-white">{{prenotazione.data}}</td>\n' +
        '      <td class="text-white">{{prenotazione.orario}}</td>\n' +
        '      <td class="text-white">{{prenotazione.stato}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><button class="btn btn-primary" type="submit" v-on:click="effettuaPrenotazioneHandler" >Imposta come effettuata</button><button class="btn btn-primary" type="submit" v-on:click="disdiciPrenotazioneHandler" >Disdici</button></div>'
    ,
    mounted: function (){
        this.getListaPrenotazioni();
    },
    methods: {
        dest: function(){
            if(this.listaPrenotazioni.length ===0){
                setTimeout(() => this.listaPrenotazioniIsVuota = true, 10);
                setTimeout(() => this.listaPrenotazioniIsRendered = false, 10);
            }else{setTimeout(() => this.listaPrenotazioniIsRendered = true, 10);
                    setTimeout(() => this.listaPrenotazioniIsVuota = false, 10);
                }
        },
        effettuaPrenotazioneHandler: function (){
            let radios = document.querySelector('input[name="radioPrenotazioni"]:checked');

            if(radios.length === 0) {
                alert('Per favore seleziona una prenotazione da impostare come effettuata.')
            }else{
                this.effettuaPrenotazione();
            }
        },
        effettuaPrenotazione: function(){
            var self = this;
            self.selectedPrenotazioni= document.querySelector("input[type='radio'][name='radioPrenotazioni']:checked").value;

            self.JSONselectedPrenotazioni = '{id: '+ '\"'+self.selectedPrenotazioni+'\"}';
            $.ajax({
                type: "POST",
                url:"effettuaPrenotazioniServlet",
                data:this.JSONselectedPrenotazioni,
                contentType: 'application/json',
                dataType: 'json'
            });
            this.listaPrenotazioniIsRendered = false;
            this.getListaPrenotazioni();
            this.$root.$refs.listastoricorender.getListaStorico();

        },
        disdiciPrenotazioneHandler: function (){
            let radios = document.querySelector('input[name="radioPrenotazioni"]:checked');

            if(radios.length === 0) {
                alert('Per favore seleziona una prenotazione da disdire.')
            }else{
                this.disdiciPrenotazione();
            }
        },
        disdiciPrenotazione: function (){
            var self = this;
            self.selectedPrenotazioni= document.querySelector("input[type='radio'][name='radioPrenotazioni']:checked").value;

            self.JSONselectedPrenotazioni = '{id: '+ '\"'+self.selectedPrenotazioni+'\"}';
            $.ajax({
                type: "POST",
                url:"disdiciPrenotazioneServlet",
                data:this.JSONselectedPrenotazioni,
                contentType: 'application/json',
                dataType: 'json'
            });
            this.getListaPrenotazioni();
            this.$root.$refs.listastoricorender.getListaStorico();

        },
        getListaPrenotazioni: function(){
            var self = this;
            $.get(this.getPrenotazioniServlet, function(data) {
                self.listaPrenotazioni = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 70);
        },
        transiInnerR: function() {
            this.$emit('transit-inner');
        }

    }

})

Vue.component('listastoricorender',{
    data: function() {
        return {
            listaStorico: [],
            listaStoricoIsRendered: false,
            link: 'listaStoricoWebServlet',
            listaStoricoIsVuota: false
        };
    },
    created() {
        this.$root.$refs.listastoricorender = this;
    },
    template:
        '<div><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '      <th scope="col" class="text-white">Stato attività</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="prenotazione in listaStorico">\n' +
        '    <tr>\n' +
        '      <td class="text-white">{{prenotazione.nomecorso}}</td>\n' +
        '      <td class="text-white">{{prenotazione.nome}} {{prenotazione.cognome}}</td>\n' +
        '      <td class="text-white">{{prenotazione.data}}</td>\n' +
        '      <td class="text-white">{{prenotazione.orario}}</td>\n' +
        '      <td class="text-white">{{prenotazione.stato}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><button class="btn btn-primary" type="submit" v-on:click="getListaStorico" >Aggiorna</button></div>'
    ,
    mounted(){
        this.getListaStorico();
    },
    methods: {
        getListaStorico: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaStorico = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
        },

    }
})
Vue.component ('listadocentirender',{
    data: function() {
        return {
            listaDocenti: [],
            listaDocentiIsRendered: false,
            listaRender: true,
            n_row: [],
            renderKey: 0,
            link: 'listaDocentiServlet',
            selectedDocenti: [],
            JSONselectedDocenti: "",
            listaDocentiIsVuota: false
        };
    },
    template: '' +
        '<table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Nome</th>\n' +
        '      <th scope="col" class="text-white">Cognome</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="docente in listaDocenti">\n' +
        '    <tr>\n' +
        '      <td class="text-white">{{docente.nome}}</td>\n' +
        '      <td class="text-white">{{docente.cognome}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table>' ,
    //mounted è una funzione che viene invocata quanto la componente è pronta
    mounted(){
        this.getListaDocenti();
        setTimeout(() => this.listaDocentiIsRendered = true, 20);

    },
    methods:{

        dest: function(){
            if(this.listaDocenti.length ===0){
                setTimeout(() => this.listaDocentiIsVuota = true, 10);
            }else{setTimeout(() => this.listaDocentiIsRendered = true, 10);}
        },
        getListaDocenti: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaDocenti = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 70);
        },
        transiInnerR: function() {
            this.$emit('transit-inner');
        }
    }
})
Vue.component('listacorsirender',{
    inject : ['listaCorsi'],
    data: function(){
        return {
            link: 'listaCorsiServlet',
            linkRimuoviCorso: 'rimuoviCorsoServlet',
            listaCorsiIsRendered: false,
            listaCorsiIsVuota: false,
        };
    },

    template:'<div v-if="listaCorsiIsVuota"><p><strong>Nessun corso disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="aggiungiCorso" >Aggiungi corso</button></div><div v-else-if="listaCorsiIsRendered">' +
        '<table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Nome</th>\n' +
        '      <th scope="col" class="text-white">Data</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="corso in listaCorsi">\n' +
        '    <tr>\n' +
        '      <td class="text-white">{{corso.nomeCorso}}</td>\n' +
        '      <td class="text-white">{{corso.date}}</td>\n' +
        '      <td class="text-white">{{corso.orario}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><button class="btn btn-primary" type="submit" v-on:click="getListaCorsi" >Aggiorna</button></div>'
    ,
    mounted(){
        this.getListaCorsi();
    },
    methods: {
        dest: function(){
            if(this.listaCorsi.length ===0){
                setTimeout(() => this.listaCorsiIsVuota = true, 70);
            }else{setTimeout(() => this.listaCorsiIsRendered = true, 70);}
        },
        getListaCorsi: function () {
            var self = this;
            $.get(this.link, function (data) {
                self.listaCorsi = data;
            });
            setTimeout(() => this.dest(), 170);
        }

    }

})
/*VUE GUEST*/
Vue.component ('listaripetizionirenderguest', {
    inject: ['username'],
    data: function(){
        return {
            listaripetizioniKey: 0,
            listaRipetizioni: [],
            selectedRipetizioni: [],
            link: 'listaPrenotaRipetizioniWebServlet',
            listaRipetizioniIsRendered: false,
            listaRipetizioniIsVuota: false,
        };
    },
    created() {
        this.$root.$refs.listaripetizionirender = this;
    },
    template:'<div v-if="listaRipetizioniIsVuota"><p><strong>Nessuna ripetizione disponibile</strong></p><button class="btn btn-primary" type="submit" v-on:click="getListaRipetizioni" >Aggiorna</button></div> <div v-else-if="listaRipetizioniIsRendered" ><table class="table table-borderless">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col" class="text-white">Seleziona</th>\n' +
        '      <th scope="col" class="text-white">Nome corso</th>\n' +
        '      <th scope="col" class="text-white">Sostenuto da</th>\n' +
        '      <th scope="col" class="text-white">Giorno</th>\n' +
        '      <th scope="col" class="text-white">Orario</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody v-for="corsodocente in listaRipetizioni">\n' +
        '    <tr>\n' +
        '      <td><input type="radio" name="radioRipetizioni" :value="corsodocente.id"></td>\n' +
        '      <td class="text-white">{{corsodocente.nomeCorso}}</td>\n' +
        '      <td class="text-white">{{corsodocente.nome}} {{corsodocente.cognome}}</td>\n' +
        '      <td class="text-white">{{corsodocente.date}}</td>\n' +
        '      <td class="text-white">{{corsodocente.orario}}</td>\n' +
        '    </tr>\n' +
        '  </tbody>\n' +
        '</table><p><strong><a href="registrazione.html" class="fw-bold text-body"><u>Registrati</u></a> per poter prenotare una ripetizione</strong></p></div>\n',
    mounted(){
        this.getListaRipetizioni();
        setTimeout(() => this.listaRipetizioniIsRendered = true, 70);
    },
    methods: {
        dest: function(){
            if(this.listaRipetizioni.length ===0){
                this.listaRipetizioniIsVuota = true;
            }else{ this.listaRipetizioniIsRendered = true;
                this.listaRipetizioniIsVuota = false;}
        },
        getListaRipetizioni: function(){
            var self = this;
            $.get(this.link, function(data) {
                self.listaRipetizioni = data;
                //self.coppie = JSON.stringify(data); // non funziona
            });
            setTimeout(() => this.dest(), 100);
        }
    }
})
new Vue({
    el: '#ripetischool',
    data: function() {
        return {
            username:'',
            listaRipetizioni:[],
            listaDocenti: [],
            getSessionServlet: 'getSessionServlet',
            listaCorsi: [],
            defaultView: true,
            login: false,
            admin: false,
            utente: false,
            mainPage: false,
            guest: false,
            aggiungiDocenteVisibile: false,
            aggiungiCorsoDocenteVisibile: false,
            primaPagina: true,
            secondaPagina: false,
            terzaPagina: true,
            terzaPagina1: false,
            yesPermission: false,
            showAll: false,
            aggiungiCorsoVisibile: false,
            isVisibileRipetizioni: true,
            isVisibileRipetizioni1: false,
            isVisibileRipetizioniForm: false,
            isVisibileCorsi: true,
            isVisibileCorsi1: false,
            guestY: '60659581ef52255f4022db758'
        }
    },
//    template:'<div v-if="showAll"></div>',

    mounted: function (){
        var self = this;
        $.get(this.getSessionServlet, function(data) {
            self.sessione = data;
            if( self.sessione.resulte=='utente'){
                self.login = false;
                self.mainPage= true;
                self.utente = true;
                self.admin=false;
                self.guest = false;
            }else if (self.sessione.resulte=='admin'){
                self.login = false;
                self.mainPage= true;
                self.admin = true;
                self.utente = false;
                self.guest = false;
            }else if(self.sessione.resulte=='guest'){
                self.login = false;
                self.mainPage= true;
                self.admin = false;
                self.utente = false;
                self.guest = true;
            }else{
                self.login = true;
            }
           // self.showAll = true;
            setTimeout(() => self.username = self.sessione.username, 80);

        });
    },
    provide: function(){
        return {
            username:  this.username
        }
    },
    methods: {
        loginP: function(){
            var username=$('#username1').val();
            var pwd=$('#password1').val();
            var self = this;
            if(pwd ==='' || username ===''){
                if(pwd ==='' && username ===''){
                    alert('Per favore inserisci un usename e una password validi');
                }else if(username ===''){
                    alert('Per favore inserisci un username valido');
                }else{
                    alert('Per favore inserisci una password valida');
                }

            }else {
                $.ajax({
                    type: "POST",
                    url: "loginServlet",
                    data: {"username": username, "password": pwd},
                    success: function (data) {
                        if (data.resulte === "utente") {
                            // $(location).attr('href', 'index.html');
                            self.login = false;
                            self.mainPage= true;
                            self.utente = true;

                        } else if (data.resulte === 'admin') {
                           // $(location).attr('href', 'adminv2.html');
                            self.login = false;
                            self.mainPage= true;
                            self.admin = true;
                        } else {
                            alert('Username e/o password sbagliati');
                        }
                    }
                });
            }
        },
        guestL: function (){
            var self = this;
            $.ajax({
                type: "POST",
                url: "loginServlet",
                data: {"username": self.guestY},
                success: function (data) {
                    if (data.resulte === "guest") {
                        self.login = false;
                        self.mainPage= true;
                        self.admin = false;
                        self.utente = false;
                        self.guest = true;
                    }
                }
            });

        },
        transit: function() {
            this.terzaPagina1 = !this.terzaPagina1;
            this.isVisibileRipetizioni1 = false;
            this.isVisibileCorsi1 = false;
        },
        toggleRipetizioniR: function (){
            this.isVisibileRipetizioni1 = !this.isVisibileRipetizioni1;
            this.isVisibileCorsi1 = false;
            this.terzaPagina1 = false;
        },
        toggleCorsoR: function (){
            this.isVisibileCorsi1 = !this.isVisibileCorsi1;
            this.terzaPagina1 = false;
            this.isVisibileRipetizioni1 = false;
        },
        transitRipetizioniRim: function() {
            this.isVisibileRipetizioni = false;

            setTimeout(() => this.isVisibileRipetizioni = true, 100);
        },
        transitRim: function() {
            this.terzaPagina = false;

            setTimeout(() => this.terzaPagina = true, 100);
        },
        transitMostraForm: function(){
            this.aggiungiDocenteVisibile = true;
            this.terzaPagina = false;
        },
        transitCorsi: function() {
            this.isVisibileCorsi = false;

            setTimeout(() => this.isVisibileCorsi = true, 100);
        },
        transitMostraFormCorsi: function(){
            this.aggiungiCorsoVisibile = true;
            this.isVisibileCorsi = false;
        },
        transitRestoreCor: function(){
            this.aggiungiCorsoVisibile = false;
            setTimeout(() => this.isVisibileCorsi = true, 50);
        },
        transitRestore: function(){
            this.aggiungiDocenteVisibile = false;
            setTimeout(() => this.terzaPagina = true, 100);
        },
        transitFormAggCorsoDocente: function (){
            this.isVisibileRipetizioniForm = true;
            this.isVisibileRipetizioni = false;
        },
        transitRestoreCD: function(){
            this.isVisibileRipetizioniForm = false;
            setTimeout(() => this.isVisibileRipetizioni = true, 100);
        },
        logout: function(){
            $.ajax({
                type: "POST",
                url: "logoutServlet"
            });
            self.$router.go(0);
        }

    }




})

var typed = new Typed(".script_write", {
    strings: ["", "zioni.", "School!"],
    typeSpeed: 200,
    backSpeed: 300,
    loop: true
});
