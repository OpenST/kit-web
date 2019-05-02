
/*************IMP Note- Currently implemented as singleton, as 2 providers cant live parallelly.*******/

;(function (window,$) {
  var ost = ns("ost"),
    utilities = ns("ost.utilities")
  ;
  
  function StakeAndMintOst() {}
  
  StakeAndMintOst.prototype = {
  
    initFlow: function () {
      var oThis = this ;
    
      var workflowId = oThis.getWorkflowId() ;
      oThis.setStakerAddress();
      if( workflowId ) {
        oThis.onWorkFlow( workflowId );
      }
    },
  
    getWalletAddress : function () {
      var oThis = this  ;
      return utilities.deepGet( oThis.dataConfig ,  "staker_address"); //TODO confirm
    },
  
    onMintToken: function () {
      var oThis = this ;
      oThis.checkForBal();
    },
  
    onConfirmStakeMintSuccess : function ( res ) {
      var oThis = this ;
       setTimeout( function () {
         utilities.btnSubmittingState(  $('#stake-and-mint-btn') );
         oThis.mint( );
       }, 0 );
    },
  
    mint : function () {
      var oThis = this ;
      $.ajax({
        url: oThis.mintApi,
        method: 'POST',
        data: oThis.getMintData(),
        success: function ( res ) {
          if( res && res.success){
            oThis.mintSuccess( res )
          }else {
            oThis.mintError( res );
          }
        },
        error: function ( jqXHr , err ) {
          oThis.mintError( err ) ;
        },
        complete : function () {
          utilities.btnSubmitCompleteState(  $('#stake-and-mint-btn') );
        }
      });
      
    },
  
    getMintData : function () {
      var oThis = this ;
      var btToMint = oThis.getBTtoMint() ,
        ostToStake = PriceOracle.btToOstPrecession( btToMint ) //As it goes to backend and comes back as is.
      ;
      //TODO get via form @Ashutosh
      var data =  {
        'fe_bt_to_mint' : btToMint ,      //JUST FOR FE
        'fe_stake_currency_to_stake' : ostToStake    //JUST FOR FE
      };
      var formData =  utilities.getFormData( $("#stake-mint-confirm-form") );
      data = $.extend( data ,formData );
      return data;
    },
  
    mintSuccess : function ( res ) {
      var oThis = this;
      window.location = oThis.redirectRoute ;
    },
  
    mintError : function ( error )  {
      //TODO
    }
    
  };
  
  ost.stakeAndMintOst  = new StakeAndMintOst();
  
})(window , jQuery );