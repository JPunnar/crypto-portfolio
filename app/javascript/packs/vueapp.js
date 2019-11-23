import Vue from 'vue/dist/vue.esm'
import Vuelidate from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Toasted from 'vue-toasted';
import axios from 'axios';
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

$.ajaxSetup({
  beforeSend: function (xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
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

        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result) {
                console.log(result);
                var index = ev.coins.indexOf(ev.coins.find(x => x.id === coinId));
                console.log("index: " + index);
                ev.$delete(ev.coins, index);
                // ev.$delete(ev.coins, ev.coins.find(x => x.id === coinId));
            }
        });
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
          .catch(e => {
            ev.$toasted.show('Error happened!');
          })
          .finally(function () {
            this.ajaxInProgress = false;
          });

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
