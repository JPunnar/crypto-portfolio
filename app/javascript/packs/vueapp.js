import Vue from 'vue/dist/vue.esm'
import Vuelidate from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Toasted from 'vue-toasted';
import axios from 'axios';
import moment from 'moment'
window.moment = moment;

Vue.use(Vuelidate);
Vue.use(Toasted, {
  position: 'top-center',
  action : {
    text : 'Close',
    onClick : (e, toastObject) => {
        toastObject.goAway(0);
    }
  },
  theme: 'outline',
  duration: 2200
});

axios.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');

document.addEventListener('DOMContentLoaded', () => {
  var coin_inventory = new Vue({
    el: '#coin_inventory',
    data: {
      coins: []
    },
    mounted: function () {
      this.fetchCoins();
    },
    methods: {
      fetchCoins: function() {
        axios.get('coins').then(response => {
          var ev = this;
          $.each(response.data.coins, function(index, value) {
            ev.coins.push(value);
          });
        })
      },
      deleteCoin: function(coinId) {
        // this.coins.find(x => x.id === coinId);
        var url = 'coins/' + coinId
        var ev = this;

        axios.delete(url).then(response => {
          var index = ev.coins.indexOf(ev.coins.find(x => x.id === coinId));
          ev.$delete(ev.coins, index);
          this.$toasted.show('Coin deleted!');
        })
      },
      formatDate: function(input) {
        return moment(input).format('MM.DD.YYYY');
      }
    }
  });

  var coin_form = new Vue({
      el: '#coin_form',
      data: {
          type: 'Bitcoin',
          amount: '',
          location: '',
          purchased_at: '',
          csrf_token: $('meta[name="csrf-token"]').attr('content'),
          ajaxInProgress: false
      },
      validations: {
        amount: {
          required
        },
        location: {
          required
        },
        purchased_at: {
          required
        }
      },
      methods: {
        addCoin: function() {
          this.ajaxInProgress = true;
          axios.post('coins', {
            type: this.type,
            amount: this.amount,
            location: this.location,
            purchased_at: this.purchased_at
          })
          .then(response => {
            this.$toasted.show('New coin added!');
            coin_inventory.coins.push(response.data.coin);
          })
          .catch(error => {
            this.$toasted.show('Error happened: ' + error.response.data.errors, {theme: 'bubble'});
          })
          .finally(() => this.ajaxInProgress = false)

          this.amount = "";
          this.location = "";
          this.purchased_at = "";
        }
      },
      computed: {
        isDisabled: function(){
        	return (this.$v.$invalid || this.ajaxInProgress);
        }
      }
  });
});
