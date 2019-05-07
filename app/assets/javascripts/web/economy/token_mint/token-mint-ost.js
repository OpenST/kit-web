
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
      return utilities.deepGet( oThis.dataConfig ,  "staker_address");
    },
  
    onMintToken: function () {
      var oThis = this ;
      oThis.checkForBal();
    },
  
    onConfirmStakeMintSuccess : function ( res ) {
      var oThis =  this ,
        data = res && res.data ,
        ostToStake = utilities.deepGet( res , "data.precise_amounts.stake_currency"),
        btToMint =   utilities.deepGet( res , "data.precise_amounts.bt" )
      ;
      oThis.setOstToStakeWei( ostToStake );
      oThis.setBtToMintWei( btToMint );
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
      var oThis = this;
      var formData =  utilities.getFormData( $("#stake-mint-confirm-form") );
      return formData;
    },
  
    mintSuccess : function ( res ) {
      var oThis = this;
      window.location = oThis.redirectRoute ;
    },
  
    mintError : function ( error )  {
     var oThis = this ;
     utilities.showGeneralError( oThis.jConfirmStakeMintForm , error );
    }
    
  };
  
  ost.stakeAndMintOst  = new StakeAndMintOst();
  
})(window , jQuery );