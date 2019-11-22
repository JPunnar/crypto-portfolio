import Vue from 'vue/dist/vue.esm'
import Vuelidate from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Toasted from 'vue-toasted';
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
  duration: 2500
});

$.ajaxSetup({
  beforeSend: function (xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

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
        var vm = this
        $.get('coins', function(data) {
          $.each(data.coins, function(index, value) {
            vm.coins.push(value);
          });
        });
      },
      deleteCoin: function(coinId) {
        // this.coins.find(x => x.id === coinId);
        var url = 'coins/' + coinId
        console.log("doing delet request for url " + url);
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
          if (this.$v.$invalid) {
            alert("errors");
          } else {
            this.ajaxInProgress = true;
            var ev = this;
            $.post( "coins", {
              type: this.type,
              amount: this.amount,
              location: this.location,
              purchased_at: this.purchased_at
            })
            $(document).ajaxComplete(function() {
              ev.ajaxInProgress = false;
            });
            $(document).ajaxSuccess(function(event, xhr, settings) {
              coin_inventory.coins.push(JSON.parse(xhr.responseText).coin);
              ev.$toasted.show('New coin added!')
            });
            $( document ).ajaxError(function() {
              $( ".log" ).text( "Triggered ajaxError handler." );
            });
          }
        }
      },
      computed: {
        isDisabled: function(){
        	return (this.$v.$invalid || this.ajaxInProgress);
        }
      }
  });
});
