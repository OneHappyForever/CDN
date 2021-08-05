/********* onload action script here *********/
jQuery(document).ready(function(){
	jQuery(document).on("change","input[name='domainradio']",function(){
		var radioVals = jQuery(this).val();
		jQuery("#domainname").val('');
		var depId = jQuery("#dpid").val();
		jQuery("#search-icon-box").attr("searchfor",radioVals);
		jQuery("#tldDropdown").removeClass("hidden");
		jQuery("#tldsearchText").addClass("hidden");
		if(radioVals == 'exist'){
			jQuery("#tldDropdown").addClass("hidden");
			jQuery("#tldsearchText").removeClass("hidden");
		}
		jQuery(".domain-result-box").addClass("hidden");
		var domainInSummary = jQuery(".wgs-domain-row-section").length;
		if(radioVals == 'register' && depId != '' && domainInSummary == 0){
			jQuery(".domain-result-box").removeClass("hidden");	
		}
	});
	jQuery(document).on("change","input[name='productRadio']",function(){
		var pid = jQuery(this).val();
		wgsAddProductGetProductRelatedInfo(this,pid);
	});
	jQuery(document).on("click","#btnAlreadyRegistered",function(){
		jQuery("#inputCustType").val('existing');
		jQuery("#btnNewUserSignup").removeClass("hidden");
		jQuery(this).addClass("hidden");
		jQuery(".panel-group.newUser").addClass("hidden");
		jQuery(".panel-group.existingUser").removeClass("hidden");		
	});
	jQuery(document).on("click","#btnNewUserSignup",function(){
		jQuery("#inputCustType").val('new');
		jQuery("#btnAlreadyRegistered").removeClass("hidden");
		jQuery(this).addClass("hidden");
		jQuery(".panel-group.existingUser").addClass("hidden");
		jQuery(".panel-group.newUser").removeClass("hidden");		
	});
	jQuery(document).on("click","ul.wgs-new-card input[name='ccinfo']",function(){
		jQuery("#inputCardCVV2").parent().addClass("hidden");
		jQuery("#newCardInfo").removeClass("hidden");
	});
	jQuery(document).on("click",".wgs-exist-cc input[name='ccinfo']",function(){
		jQuery("#newCardInfo").addClass("hidden");
		jQuery("#inputCardCVV2").parent().removeClass("hidden");
	});
	jQuery(document).on("click",".bttn",function(){
	  jQuery(".oredr-summary,.right-side").toggleClass("main");
	  jQuery('body').toggleClass('wgsoverlay');
	});
	jQuery(document).on("click",".clsResp",function(){
	  jQuery(".oredr-summary,.right-side").toggleClass("main");
	  jQuery('body').toggleClass('wgsoverlay');
	});
	jQuery(document).on("click","p.hosting-wgs	",function(){
		jQuery('html,body').animate({
				scrollTop: jQuery(".choose-plan-wrapper").offset().top},
				'slow');
	});
	jQuery(document).on("change","input[name='billingcycle']",function(){
		if(jQuery(".check_box.Billing").hasClass("active")){
			jQuery(".check_box.Billing").removeClass("active");
		}
		jQuery(this).parent().addClass("active");
		wgsCallAjaxForConfigureProduct();
	});
	jQuery(document).on("change","#inputDomainContact",function(){
		var getValue = jQuery(this).val();
		if(getValue == 'addingnew'){
			jQuery('#domainRegistrantInputFields').removeClass("hidden");
		}else{
			jQuery('#domainRegistrantInputFields').addClass("hidden");
		}
	});
	jQuery(document).on("keyup","#wgs-customs-fields input[type='text'], #wgs-customs-fields input[type='password']",function(){
       wgsCallAjaxForConfigureProduct();		
	});
	jQuery(document).on("change","#wgs-customs-fields select",function(){
		wgsCallAjaxForConfigureProduct();		
	});
	jQuery(document).on("click","#wgs-customs-fields input[type='radio'],#wgs-customs-fields input[type='checkbox']",function(){
		wgsCallAjaxForConfigureProduct();	
	});
	jQuery(document).on("click",".wgs-domain-custom-field input[type='radio'],.wgs-domain-custom-field input[type='checkbox']",function(){	
		wgsConfigDomainOption();
	});
	jQuery(document).on("change",".wgs-domain-custom-field select",function(){
		wgsConfigDomainOption();
	});
	jQuery(document).on("keyup",".wgs-domain-custom-field input[type='text'], .wgs-domain-custom-field input[type='password']",function(){		
		wgsConfigDomainOption();
	});
// password strength
	jQuery(document).on("keyup","#inputNewPassword1",function(){
		passwordStrength = getPasswordStrength(jQuery(this).val());
		if (passwordStrength >= 75) {
			textLabel = langPasswordStrong;
			cssClass = 'success';
		} else
			if (passwordStrength >= 30) {
				textLabel = langPasswordModerate;
				cssClass = 'warning';
			} else {
				textLabel = langPasswordWeak;
				cssClass = 'danger';
			}
		jQuery("#passwordStrengthTextLabel").html(langPasswordStrength + ': ' + passwordStrength + '% ' + textLabel);
		jQuery("#passwordStrengthMeterBar").css(
			'width',
			passwordStrength + '%'
		).attr('aria-valuenow', passwordStrength);
		jQuery("#passwordStrengthMeterBar").removeClass(
			'progress-bar-success progress-bar-warning progress-bar-danger').addClass(
			'progress-bar-' + cssClass);
	});	
// code for payment gateways start 
	var existingCards = jQuery('.existing-card'),
        cvvFieldContainer = jQuery('#cvv-field-container'),
        existingCardContainer = jQuery('#existingCardsContainer'),
        newCardInfo = jQuery('#newCardInfo'),
        existingCardInfo = jQuery('#existingCardInfo'),
        newCardOption = jQuery('#new'),
        creditCardInputFields = jQuery('#creditCardInputFields');
    jQuery(document).on("click", existingCards, function(event) {
        if (jQuery('.payment-methods:checked').val() === 'stripe') {
            return;
        }
        newCardInfo.slideUp().find('input').attr('disabled', 'disabled');
        existingCardInfo.slideDown().find('input').removeAttr('disabled');
    });
    jQuery(document).on("click",newCardOption, function(event) {
        if (jQuery('.payment-methods:checked').val() === 'stripe') {
            return;
        }
        newCardInfo.slideDown().find('input').removeAttr('disabled');
        existingCardInfo.slideUp().find('input').attr('disabled', 'disabled');
    });
    if (!existingCards.length) {
        existingCardInfo.slideUp().find('input').attr('disabled', 'disabled');
    }
	jQuery(document).on("click","input[name='paymentmethod']",function(){
			var existingCards = jQuery('.existing-card'),
			cvvFieldContainer = jQuery('#cvv-field-container'),
			existingCardContainer = jQuery('#existingCardsContainer'),
			newCardInfo = jQuery('#newCardInfo'),
			existingCardInfo = jQuery('#existingCardInfo'),
			newCardOption = jQuery('#new'),
			creditCardInputFields = jQuery('#creditCardInputFields');
		if(jQuery(this).hasClass('is-credit-card')){
			jQuery('#creditCardInputFields').removeClass("hidden");
			var gatewayPaymentType = jQuery(this).attr('data-payment-type'),
			gatewayModule = jQuery(this).val(),
			showLocal = jQuery(this).attr('data-show-local'),
			relevantMethods = [];
			jQuery('.existing-card').each(function(index) {
				var paymentType = jQuery(this).attr('data-payment-type'),
				paymentModule = jQuery(this).attr('data-payment-gateway'),
				payMethodId = jQuery(this).val();
				var paymentTypeMatch = (paymentType === gatewayPaymentType);
				var paymentModuleMatch = false;
				if(gatewayPaymentType === 'RemoteCreditCard') {
					// only show remote credit cards that belong to the selected gateway
					paymentModuleMatch = (paymentModule === gatewayModule);
				}else if(gatewayPaymentType === 'CreditCard') {
					// any local credit card can be used with any credit card gateway
					paymentModuleMatch = true;
				}
				if(showLocal && paymentType === 'CreditCard') {
					paymentTypeMatch = true;
					paymentModuleMatch = true;
				}
				var payMethodElements = jQuery('[data-paymethod-id="' + payMethodId + '"]');
				if(paymentTypeMatch && paymentModuleMatch) {
					jQuery(payMethodElements).show();
					relevantMethods.push(this);
				}else{
					jQuery(payMethodElements).hide();
				}
			});
			var enabledRelevantMethods = relevantMethods.filter(function (item) {
				return ! jQuery(item).attr('disabled');
			});
			if (enabledRelevantMethods.length > 0) {
				var defaultId = null;
				jQuery.each(enabledRelevantMethods, function(index, value) {
					var jQueryElement = jQuery(value),
						order = parseInt(jQueryElement.attr('data-order-preference'), 10);
					if ((defaultId === null) || (order < defaultId)) {
						defaultId = jQueryElement.val();
					}
				});
				if (defaultId === null) {
					defaultId = 'new';
				}
				jQuery.each(enabledRelevantMethods, function(index, value) {
					var jQueryElement = jQuery(value);
					if (jQueryElement.val() === defaultId) {
						jQueryElement.iCheck('check');
						return false;
					}
				});
				existingCardContainer.show();
				existingCardInfo.removeClass('hidden').show().find('input').removeAttr('disabled');
			}else{
				jQuery(newCardOption).trigger('click');
				existingCardContainer.hide();
				existingCardInfo.hide().find('input').attr('disabled', 'disabled');
			}
			if (!creditCardInputFields.is(":visible")) {
				creditCardInputFields.hide().removeClass('hidden').slideDown();
			}
		}else{
			jQuery('#creditCardInputFields').addClass("hidden");
		}
	});
// code for payment gateways end here

});	
/****** search button clicked **********/
function wgsSearchdomain(obj){
	jQuery(".domain-result-box").addClass("hidden");
	jQuery(obj).html('<i class="fa fa-spinner fa-spin"></i>');
	jQuery("#loaderSpins").removeClass("hidden");
	var tokenget = jQuery("input[name='token']").val();
	var domainName = jQuery("#domainname").val();
	if(jQuery.trim(domainName) == ''){
		jQuery("#domainname").focus();
		jQuery("#loaderSpins").addClass("hidden");
		jQuery("#search-icon-box").html('<i class="fa fa-search"></i>');		
	}else{
		var tldlist = jQuery("#tldDropdown").val();
		var fullDomainName = domainName+tldlist;
		var searchFor = jQuery(obj).attr("searchfor");
		if(searchFor == 'register'){
			jQuery(".domain-suggestion-main").addClass("hidden");
			wgsCallAjaxDomain(tokenget,fullDomainName,'domain','register');
			//wgsCallAjaxDomain(tokenget,fullDomainName,'spotlight','register');
			wgsCallAjaxDomain(tokenget,fullDomainName,'suggestions','register');
		}else if(searchFor == 'transfer'){
			jQuery(".domain-suggestion-main").addClass("hidden");
			jQuery(".domain-available-container").removeClass("errorUnavail");
			jQuery(".domain-available-container").html('');
			jQuery(".domain-suggestion").html('');
			wgsCallAjaxDomainTransfer(tokenget,fullDomainName,'transfer',domainName,tldlist,'transfer');
		}else if(searchFor == 'exist'){
			var tlsearchtxt = jQuery("#tldsearchText").val();
			if(jQuery.trim(tlsearchtxt) == ''){
				jQuery("#tldsearchText").focus();
				jQuery("#loaderSpins").addClass("hidden");
				jQuery("#search-icon-box").html('<i class="fa fa-search"></i>');
			}else{
				wgsDomainAddOwnDomain(domainName,tlsearchtxt);
			}
		}
	}
}
/********** Function call for domain transfer feature **********/
function wgsCallAjaxDomainTransfer(tokenget,fullDomainName,domaintype,domainsld,domaintld,domainresponseFor){
	jQuery.ajax({
		type: "POST",
		url: 'index.php?rp=/domain/check',
		data:{
			'token':tokenget,
			'domain':fullDomainName,
			'type':domaintype,
			'sld':domainsld,
			'tld':domaintld,
			'source': 'cartAddDomain',
		},
		success:function (data) {
			var responseArray = createResponseArray(data,domainresponseFor);
			if(responseArray.domainlegecystatus == 'unavailable'){
				jQuery(".domain-available-container").removeClass("errorUnavail");
				jQuery(".domain-available-container").html('');
				var availableDomain = '<div class="cong-massage"><p>'+eligibleTransfer+'</p><p>'+eligibleTransferMsg+'</p><p  class="transferWg">'+eligibleTransferForUs+' '+responseArray.domainprice+' <button class="add-to-cart-btn" onclick="wgsDomainAddToCart(this,\''+responseArray.domainname+'\',\''+domainresponseFor+'\',\''+addCart+'\');">'+addCart+'</button><button class="add-to-cart-btn removeBtnCat hidden" data-domain-name="'+responseArray.domainname+'" onclick="wgsDomainRemoveToCart(this,\''+responseArray.domainname+'\',\''+domainresponseFor+'\',\''+removeCart+'\');">'+removeCart+'</button></p></div>';
				jQuery(".domain-available-container").html(availableDomain);
				jQuery(".domain-available-container").removeClass("hidden");
				jQuery(".domain-result-box").removeClass("hidden");	
			}else if(responseArray.domainlegecystatus == 'available'){
				jQuery(".domain-available-container").addClass("errorUnavail");
				jQuery(".domain-available-container").html('');
				var unavailableDomain = '<div class="cong-massage"><p>'+notEligibleTransfer1+'</p><p>'+notEligibleTransfer2+'</p><p>'+notEligibleTransfer3+'</p><p>'+notEligibleTransfer4+'</p></div>';
				jQuery(".domain-available-container").html(unavailableDomain);
				jQuery(".domain-available-container").removeClass("hidden");
				jQuery(".domain-result-box").removeClass("hidden");				
			}
			jQuery("#loaderSpins").addClass("hidden");
			jQuery("#search-icon-box").html('<i class="fa fa-search"></i>');
		},                                 		         
	});
}
/********** Function call for domain register,suggestion,spotlight feature **********/		
function wgsCallAjaxDomain(tokenget,fullDomainName,domaintype,domainresponseFor){
	jQuery.ajax({
		type: "POST",
		url: 'index.php?rp=/domain/check',
		data:{
			'token':tokenget,
			'a':'checkDomain',
			'domain':fullDomainName,
			'type':domaintype,
		},
		success:function (data) {
			if(domaintype == 'domain'){
				var responseArray = createResponseArray(data,domainresponseFor);
				if(responseArray.domainerror){
					var errorsn = '<p>'+responseArray.domainerror+contactAdminstartor+'</p>';
					jQuery("#domainErrorD").html('');
					jQuery("#domainErrorD").html(errorsn);
					jQuery("#domainErrorD").removeClass("hidden");
					jQuery('html, body').animate({
						scrollTop: jQuery("#domainErrorD").offset().top
					}, 1000);
					setTimeout(function() { 
						jQuery("#domainErrorD").addClass("hidden");
						jQuery("#domainErrorD").html('');	
					}, 5000);					
				}else if(responseArray.domainlegecystatus == 'available'){
					jQuery("#domainErrorD").html('');
					jQuery("#domainErrorD").addClass("hidden");
					var availableDomain = '<div class="cong-massage"><p><span>'+domainavailable1+'</span> '+domainavailable2+'</p><div class="row wgs-domain-res"><div class="col-md-4"><h3>'+responseArray.domainname+'</h3></div><div class="col-md-4"><h2>'+responseArray.domainprice+'</h2></div><div class="col-md-4"><button class="add-to-cart-btn" onclick="wgsDomainAddToCart(this,\''+responseArray.domainname+'\',\''+domainresponseFor+'\',\''+addCart+'\');">'+addCart+'</button><button class="add-to-cart-btn removeBtnCat hidden" data-domain-name="'+responseArray.domainname+'" onclick="wgsDomainRemoveToCart(this,\''+responseArray.domainname+'\',\''+domainresponseFor+'\',\''+removeCart+'\');">'+removeCart+'</button></div></div></div>';
					jQuery(".domain-available-container").removeClass("errorUnavail");
					jQuery(".domain-available-container").html('');
					jQuery(".domain-available-container").html(availableDomain);
					jQuery(".domain-available-container").removeClass("hidden");
					jQuery(".domain-result-box").removeClass("hidden");
				}else{
					jQuery("#domainErrorD").html('');
					jQuery("#domainErrorD").addClass("hidden");
					var unavailableDomain = '<div class="cong-massage"><p><span>'+responseArray.domainname+'</span> '+domainUnavailable+'</p></div>';
					jQuery(".domain-available-container").addClass("errorUnavail");
					jQuery(".domain-available-container").html('');
					jQuery(".domain-available-container").html(unavailableDomain);
					jQuery(".domain-available-container").removeClass("hidden");
					jQuery(".domain-result-box").removeClass("hidden");
				}
				jQuery("#loaderSpins").addClass("hidden");
			    jQuery("#search-icon-box").html('<i class="fa fa-search"></i>');
			}else if(domaintype == 'spotlight'){
				//jQuery.each(data.result, function(t,n){
				//});
			}else if(domaintype == 'suggestions'){
					jQuery(".domain-suggestion").html('');
					var suggest = '';
					var counter = 0;
					var classHidden = '';
					jQuery.each(data.result, function(t,n){
						if(counter > 4){
							classHidden = 'hidden';
							jQuery(".domain-name-btn-container").removeClass("hidden");
						}
						var priceGet = n['pricing'][1].register;
						priceGet = priceGet.split(' ');
						suggest += '<div class="domain-name-container '+classHidden+'"><h6 class="hot-tag '+n.group+'">'+n.group+'</h6><h3>'+n.domainName+'</h3><h2> '+priceGet[0]+'<sub>'+priceGet[1]+'</sub></h2><button class="add-to-cart-btn" onclick="wgsDomainAddToCart(this,\''+n.domainName+'\',\''+domainresponseFor+'\',\''+addCart+'\');">'+addCart+'</button><button class="add-to-cart-btn removeBtnCat hidden" data-domain-name="'+n.domainName+'" onclick="wgsDomainRemoveToCart(this,\''+n.domainName+'\',\''+domainresponseFor+'\',\''+removeCart+'\');">'+removeCart+'</button></div>';
						counter = counter+1;
					});
					jQuery(".domain-suggestion").html(suggest);
					jQuery(".domain-suggestion-main").removeClass("hidden");
			}
		},                                 		         
	});
}
/*********** function for create array and return data with domain info ************/		
function createResponseArray(domainArr,domainType){
	var decodeJsons = jQuery.parseJSON(JSON.stringify(domainArr));
	var domainParams = {};
	if(decodeJsons.result['error']){
		domainParams["domainerror"] = decodeJsons.result['error'];
	}else if(decodeJsons.result[0].preferredTLDNotAvailable){
		domainParams["domainerror"] = preferedTlds;
	}else{
		var jsonDecodeRes = decodeJsons.result[0];
		var domainStatus = jsonDecodeRes.isAvailable;
		var domainName = jsonDecodeRes.domainName;
		var lagecyStatus = jsonDecodeRes.legacyStatus;
		if(domainType == 'register'){
			var domainPriceRaw = jsonDecodeRes['pricing'][1].register;
		}else if(domainType == 'transfer'){
			var domainPriceRaw = jsonDecodeRes['pricing'][1].transfer;
		}else if(domainType == 'renew'){
			var domainPriceRaw = jsonDecodeRes['pricing'][1].renew;
		}
		domainParams["domainname"] = domainName;
		domainParams["domainprice"] = domainPriceRaw;
		domainParams["domainstatus"] = domainStatus;
		domainParams["domainlegecystatus"] = lagecyStatus;
	}
	return domainParams;
}
/********** function called for more suggestion in case of domain register ***********/
function wgsMoreSuggestion(obj){
	var counter = 0;
	jQuery("#lesssuggestion").removeClass("hidden");
	jQuery(".domain-suggestion").find(".domain-name-container.hidden").each(function(){
		if(counter < 5){
			jQuery(this).removeClass("hidden");
			jQuery(this).addClass("sl");
		}
		counter = counter+1;
	});
}
/********** function called for reduce suggestion functionality ************/
function wgsLessSuggestion(obj){
	var counter = 1;
	var lengthCount = jQuery(".domain-suggestion").find(".domain-name-container.sl").length-5;
	jQuery(".domain-suggestion").find(".domain-name-container.sl").each(function(){
		if(counter > lengthCount ){
			jQuery(this).removeClass("sl");
			jQuery(this).addClass("hidden");
		}
		counter = counter+1;
	});
	var lengthCount = jQuery(".domain-suggestion").find(".domain-name-container.sl").length;
	if(lengthCount == 0){
		jQuery(obj).addClass("hidden");
	}
	jQuery('html, body').animate({
        scrollTop: jQuery(".domain-suggestion").offset().top
    }, 1000);
}
/****** function for load checkout file **********/
function wgsLoadCheckoutPage(){
	jQuery.ajax({
		type: "POST",
		url: 'cart.php?a=checkout&ajax=1',
		data: {},
		success: function (data) {
			jQuery("#loaderSpinsFirstTime").addClass("hidden");
			jQuery("#wgs_checkout_data").html('');
			jQuery("#wgs_checkout_data").html(data);
		},
	});	
}
/********** function called for product group change functionality *******/
function wgsSelectProductGroup(obj){
	var groupId = jQuery(obj).val();
	jQuery(".choose-pla-wrapper").addClass("hidden");
	jQuery('.choose-billing-wrapper').addClass("hidden");
	jQuery('.Add-ons-wrapper').addClass("hidden");
	jQuery('.wgs_product_configuration').addClass("hidden");
	jQuery("#productBoxWgs").html('');
	jQuery('#wgsBillingCycleDiv').html('');
	jQuery('#wgsProductAddons').html('');
	jQuery('.wgs_product_configuration').html('');
	if(groupId != ''){ 
		jQuery("#loaderSpinsProduct").removeClass("hidden");
		jQuery.ajax({
			type: "POST",
			url: '',
			data:{
				'actionOnePage':'callAjaxMethod',
				'methodOnePage':'getProduct',
				'gid':groupId,
			},
			success:function (data) {
				jQuery("#loaderSpinsProduct").addClass("hidden");
				var decodeJson = jQuery.parseJSON(data);
				var lengthGet = jQuery(decodeJson).length;
				var productString = '';
				productString += '<div class="prodWgs">';
				jQuery.each(decodeJson,function(t,n){
					var productDescription = n.pdescp;
					var domainRequired = '';
					if(n.pdomainoption == 1){
						domainRequired = '<div class="chk-note">'+wgsOnePageDomainRequired+'</div>';
					}
					productString += '<div class="col-sm-12 col-md-4 intel_box"><div class="check_box"><input type="radio" id="prod'+n.pid+'" value="'+n.pid+'" name="productRadio"><label for="prod'+n.pid+'">'+domainRequired+'<span class="xeon"><strong>'+n.pname+'</strong><span class="ram-box">'+productDescription+'</span></span><span class="price"><span>'+n.pprice+'</span><del></del></span></label></div></div>';
				});
				productString += '</div>';
				jQuery("#productBoxWgs").html('');
				jQuery("#productBoxWgs").html(productString);
				jQuery(".choose-pla-wrapper").removeClass("hidden"); 
				if(lengthGet > 1){
					jQuery(".prodWgs").not('.slick-initialized').slick({
					   dots: true,
					   infinite: true,
					   slidesToShow: 3,
					   slidesToScroll: 3,
					   autoplay: false,
					   autoplaySpeed: false,
					   variableWidth: false,
					   responsive: [
					    {breakpoint: 1024,settings: {slidesToShow: 3,slidesToScroll: 3,}},
						{breakpoint: 700,settings: {slidesToShow: 2,slidesToScroll: 2}},
						{breakpoint: 600,settings: {slidesToShow: 1,slidesToScroll: 1}},
						{breakpoint: 480,settings: {slidesToShow: 1,slidesToScroll: 1}},
						{breakpoint: 280,settings: {slidesToShow: 1,slidesToScroll: 1}}
						]
					});
				}
				var checkIfProductaddedFromQuery = jQuery("#productIdFirstTime").val();
				if(checkIfProductaddedFromQuery != ''){
					jQuery("#productIdFirstTime").val('');
					jQuery("input[name='productRadio']").removeAttr('checked');
					jQuery("#prod"+checkIfProductaddedFromQuery).prop("checked", true);
					var getSlideCount = jQuery("#prod"+checkIfProductaddedFromQuery).parent().parent().attr("data-slick-index");
					if(getSlideCount > 2){
					   var clickSlideNo = Math.ceil(parseFloat(parseInt(getSlideCount) + 1)/3);
						jQuery('ul.slick-dots li:nth-child('+clickSlideNo+')').trigger('click');
					}
					wgsAddProductGetProductRelatedInfo(obj,checkIfProductaddedFromQuery);
				}
			},                                 		         
		});
	}
}
/******* function for add product and get product info *********/
function wgsAddProductGetProductRelatedInfo(obj,pid){
	jQuery("#loaderSpinsBilling").removeClass("hidden");
	jQuery(".wgs_product_configuration").addClass("hidden");
	jQuery(".wgs_product_configuration").html('');
	jQuery("#dpid").val('');
	jQuery("#pidcnt").val('');
	jQuery("#domainname").val('');
	jQuery(".wgs-choose-dms").addClass("hidden");
	jQuery(".registerDm").addClass("hidden");
	jQuery(".ownDm").addClass("hidden");
	jQuery(".transferDm").addClass("hidden");
	jQuery(".domain-result-box").addClass('hidden');
	jQuery("#btnDomainManages").prop("disabled",false);
	jQuery.ajax({
		type: "POST",
		url: '',
		data:{
			'actionOnePage':'callAjaxMethod',
			'methodOnePage':'getProductRelatedInfo',
			'pid':pid,
		},
		success:function (data) {
			var decodeJson = jQuery.parseJSON(data);
			wgsGetProductConfigOption(decodeJson.sessioncount);
			if(decodeJson.domainrequired == 1){
				wgsManagePidDomain(pid,decodeJson.sessioncount);
			}
			wgsDomainConfigureAddDomain();
		},                                 		         
	});	
}
/**** config product function ************/
function wgsGetProductConfigOption(data){
	jQuery.post("cart.php", 'ajax=1&a=confproduct&i='+data,
	function (data) {
			if(data != 'An Error Occurred. Please Try Again.' && data != 'An Error Occurred. Try Again.') {
			   jQuery('.wgs_product_configuration').html(data);
			}else{
			   jQuery('.wgs_product_configuration').html('');
			}
		cartsummary();
		wgsPromoAddonReplace();
		var lengthAddonProduct = jQuery(".wgsAddonSlider .add-ons").length;	
		if(lengthAddonProduct > 1){
			setTimeout(function () {
			jQuery(".wgsAddonSlider").not('.slick-initialized').slick({
			   dots: true,
			   infinite: true,
			   slidesToShow: 4,
			   slidesToScroll: 4,
			   autoplay: false,
			   autoplaySpeed: false,
			   variableWidth: false,
			   responsive: [
				{breakpoint: 1024,settings: {slidesToShow: 4,slidesToScroll: 4,}},
				{breakpoint: 700,settings: {slidesToShow: 3,slidesToScroll: 3}},
				{breakpoint: 600,settings: {slidesToShow: 2,slidesToScroll: 2}},
				{breakpoint: 480,settings: {slidesToShow: 1,slidesToScroll: 1}},
				{breakpoint: 280,settings: {slidesToShow: 1,slidesToScroll: 1}}
				]
			});	
			}, 1000);
		}
		var checkIfBillingaddedFromQuery = jQuery("#productBillCycle").val();
		if(checkIfBillingaddedFromQuery != ''){
			jQuery("#productBillCycle").val('');
			jQuery("input[name='billingcycle']").removeAttr('checked');
			jQuery("input[name='billingcycle']").each(function(){
				if(jQuery(this).val() == checkIfBillingaddedFromQuery){
					jQuery(this).trigger('click');
				}
			});
		}		
		jQuery("#loaderSpinsBilling").addClass("hidden");
		jQuery("#wgsProductAddons").removeClass("hidden");
		jQuery('.wgs_product_configuration').removeClass("hidden");
	});	
}
/**********function for replacement promo addon ********/
function wgsPromoAddonReplace(){
	var panelHtml = '';
	var promoCounter = 0;
	jQuery(".wgs_promo_data").find(".addon-promo-container").each(function(){
		var lihtml = '';
		var imagesrc = jQuery(this).find('.description').find('.logo').find('img').attr('src');
		var heading = jQuery(this).find('.description').find('h3').text();
		var description = jQuery(this).find('.description').find('p').html();
		panelHtml += '<div class="panel-group"><div class="panel">';
		panelHtml += '<div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" href="#collapsepromo'+promoCounter+'" aria-expanded="false" class="collapsed"><img src="'+imagesrc+'"> '+heading+' <i class="fa fa-chevron-down" aria-hidden="true"></i></a></h4></div>';
		panelHtml += '<div id="collapsepromo'+promoCounter+'" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">';
		panelHtml += '<div class="panel-body"><p>'+description+'</p>';
		jQuery(this).find('label.radio-inline').each(function(){
			var radioHtml = jQuery(this).html();
			lihtml += '<li><div class="myCheckbox"><label class="lab-text radio-inline" onclick="wgsCallAjaxForConfigureProduct();">'+radioHtml+'</label></div></li>';
		});
		panelHtml += '<ul>'+lihtml+'</ul>';
		panelHtml +='</div></div></div></div>';
		promoCounter = promoCounter+1;
	});
	jQuery("#addonPromos").html('');
	jQuery("#wgs_promo_wraper").html('');
	jQuery("#wgs_promo_wraper").html(panelHtml);	
}

/********* function to call ajax on configure page ********/
function wgsCallAjaxForConfigureProduct(){
  jQuery.post("cart.php", 'ajax=1&a=confproduct&' + jQuery("#frmConfigureProduct").serialize(),
   function (data) {
	   if (data != '') {
		   cartsummary();
		   jQuery('#containerProductValidationErrors').removeClass('hidden').html(data);
		   //jQuery('html, body').animate({scrollTop: jQuery("#containerProductValidationErrors").offset().top - 80}, 300);
	   } else {
		   cartsummary();
		   jQuery('#containerProductValidationErrors').addClass('hidden').html('');
	   }
   });
}

/******** function to call cart summary ********/
function cartsummary() {
   jQuery("#wgssummaryloaders").removeClass("hidden");
   jQuery.post("cart.php", 'a=view&ajax=1',
           function (data) {
               jQuery("#wgs-right-cart").html(data);
			   if(jQuery("#wgsCartCount").val() > 0){
				   jQuery("span.wgs-custom-label-cart-one-page").addClass("wgsblink");
				   jQuery("span.wgs-custom-label-cart-one-page").text(jQuery("#wgsCartCount").val());
			   }
               jQuery("#wgssummaryloaders").addClass("hidden");
           });
		var checkIfPromoaddedFromQuery = jQuery("#productPromocode").val();
		if(checkIfPromoaddedFromQuery != ''){
			setTimeout(function () {
				if(jQuery('.apply-box').length > 0){
					jQuery("#inputPromotionCode").val('');
					jQuery("#inputPromotionCode").val(checkIfPromoaddedFromQuery);
					jQuery("#btnPromoApply").trigger('click');
				}
			}, 1000);
		}
}
/***** function remove product from cart *******/
function wgsRemoveProductFromCart(obj){
  jQuery(obj).attr('disabled', true);
  var removeType = jQuery("#inputRemoveItemType").val();
  jQuery.post("cart.php", 'ajax=1&' + jQuery("#form-remove-product").serialize(),
   function (data) {
	   if (data != '') {
		   cartsummary();
	   } else {
		   cartsummary();
		   jQuery('#containerProductValidationErrors').addClass('hidden').html('');
	   }
		if(removeType == 'd'){
			var domainNamesd = jQuery(obj).attr('remove-data-d');
			jQuery(".domain-result-box").find("button.removeBtnCat").each(function(){
				if(jQuery(this).attr("data-domain-name") == domainNamesd){
					jQuery(this).addClass("hidden");
					jQuery(this).prev("button").removeClass("hidden");
				}
			});
		}
		if(removeType == 'p'){
			var iValue = jQuery("#inputRemoveItemRef").val();
			var formClass = jQuery("#frmConfigureProduct").attr("class");
			var classmatch = 'pidConf'+iValue;
			var productIds = jQuery(obj).attr('remove-data-p');	
			if(formClass == classmatch){
				jQuery("#prod"+productIds).removeAttr('checked');
			}else{
				jQuery("input[name='productRadio']").removeAttr('checked');
			}
			jQuery(".wgs_product_configuration").addClass("hidden");
			jQuery(".wgs_product_configuration").html('');
		}
		wgsDomainConfigureAddDomain();
		wgsLoadCheckoutPage();
		jQuery(obj).attr('disabled', false);
		jQuery("#modalRemoveItem").modal("hide");
   });
  jQuery('body').removeClass("modal-open");
  jQuery('body').removeAttr("style");
}
/********* function for remove all product from cart ******/
function wgsRemoveProductFromCartAll(obj){
  jQuery(obj).attr('disabled', true);
  jQuery('body').removeClass("modal-open");
  jQuery('body').removeAttr("style");
  jQuery.post("cart.php", 'ajax=1&' + jQuery("#form-remove-all-product").serialize(),
   function (data) {
	   if (data != '') {
		   cartsummary();
	   } else {
		   cartsummary();
		   jQuery('#containerProductValidationErrors').addClass('hidden').html('');
	   }
	   window.location = 'cart.php';
   });	
}
/***** function for promocode apply ******/
function wgsApplyPromo(btntxt) {
   if (jQuery("#inputPromotionCode").val() == '') {
       jQuery("#inputPromotionCode").focus();
       jQuery("#inputPromotionCode").css('border-bottom', '1px solid #ff0000');
       return false;
   }
   jQuery("#inputPromotionCode").css('border-bottom', '1px solid #d2d2d2');
   jQuery('#btnPromoApply').html(btntxt + ' <i class="fa fa-spinner fa-spin"></i>');
   jQuery.post("cart.php", {a: "applypromo", promocode: jQuery("#inputPromotionCode").val()},
   function (data) {
       if (data) {
           alert(data);
       } else {
           cartsummary();
       }
       jQuery('#btnPromoApply').html(btntxt);
   });
}
/******* function for promocode remove *****/
function wgsRemovePromo(btntxt){
   var response = confirm(removePromoCode);
   if (response) {
       jQuery('#btnRemovePromo').html(btntxt + ' <i class="fa fa-spinner fa-spin"></i>');
       jQuery.post("cart.php", {a: "removepromo", ajax: 1},
       function (data) {
           cartsummary();
           jQuery('#btnRemovePromo').html(btntxt);
       });
   }
}
/**** function for trigger gateway ********/
function triggerPaymentMethod(obj, id){
	jQuery('.pymntmthd').each(function(){
		jQuery(this).removeClass('active');
	});
	jQuery(obj).addClass('active');
	jQuery('#id'+id).trigger('click');
	jQuery(".wgs-exist-cc").find(".paymethod-info.radio-inline").each(function(){
		if(jQuery(this).css('display') == 'none'){
			jQuery(this).parent().parent().css('display','none');
		}else{
			jQuery(this).parent().parent().css('display','flex');
		}
	});
	if(jQuery(".wgs-exist-cc").find(".paymethod-info.radio-inline").length > 0){
		jQuery("#newCardInfo").addClass("hidden");
	}
	if(jQuery('#id'+id).hasClass("is-credit-card")){
		jQuery("#inputCardCVV2").parent().removeClass("hidden");
	}else{
		jQuery("#inputCardCVV2").parent().addClass("hidden");
	}
}
/**** function for add domain in cart *******/
function wgsDomainAddToCart(obj,domainName,domaintype,btntxt){
	jQuery(obj).attr('disabled', true);
	var pidGet = jQuery("#dpid").val();
	var pidcount = jQuery("#pidcnt").val();
	jQuery(obj).html(btntxt + ' <i class="fa fa-spinner fa-spin"></i>');
	jQuery.ajax({
		type: "POST",
		url: '',
		data:{
			'actionOnePage':'callAjaxMethod',
			'methodOnePage':'addDomainToCart',
			'domain':domainName,
			'type':domaintype,
			'pidAdd':pidGet,
			'pidCount':pidcount,
		},
		success:function (data) {
			if(data == 0){
				jQuery("#domainErrorD").html('<p>'+domainAlreadyExist+'</p>');
				jQuery("#domainErrorD").removeClass("hidden");
				jQuery(obj).html(btntxt);
				jQuery(obj).attr('disabled', false);
				jQuery('html, body').animate({
					scrollTop: jQuery("#domainErrorD").offset().top
				}, 1000);
				setTimeout(function() { 
                    jQuery("#domainErrorD").addClass("hidden");
					jQuery("#domainErrorD").html('');	
                }, 5000); 
			}else{
				jQuery(obj).addClass("hidden");
				jQuery(obj).next("button").removeClass("hidden");
				jQuery(obj).html(btntxt);
				jQuery(obj).attr('disabled', false);
			}
			wgsDomainConfigureAddDomain();
			wgsLoadCheckoutPage();
		},                                 		         
	});	
}
/**** function for add domain when own domain use *******/
function wgsDomainAddOwnDomain(sld,tld){
	var pidGet = jQuery("#dpid").val();
	var pidcount = jQuery("#pidcnt").val();
	jQuery.ajax({
		type: "POST",
		url: '',
		data:{
			'actionOnePage':'callAjaxMethod',
			'methodOnePage':'ownDomainAdd',
			'tld':tld,
			'sld':sld,
			'pidAdd':pidGet,
			'pidCount':pidcount,
		},
		success:function (data) {
			if(data == 0){
				jQuery("#domainErrorD").html('<p>'+wgsOnePageOwnDomain+'</p>');
				jQuery("#domainErrorD").removeClass("hidden");
				jQuery('html, body').animate({
					scrollTop: jQuery("#domainErrorD").offset().top
				}, 1000);
				setTimeout(function() { 
                    jQuery("#domainErrorD").addClass("hidden");
					jQuery("#domainErrorD").html('');	
                }, 5000); 
			}
			jQuery("#loaderSpins").addClass("hidden");
			jQuery("#search-icon-box").html('<i class="fa fa-search"></i>');
			cartsummary();
			wgsLoadCheckoutPage();
		},                                 		         
	});
}
/**** function for add domain in cart *******/
function wgsDomainRemoveToCart(obj,domainName,domaintype,btntxt){
	jQuery(obj).attr('disabled', true);
	var pidGet = jQuery("#dpid").val();
	var pidcount = jQuery("#pidcnt").val();
	jQuery(obj).html(btntxt + ' <i class="fa fa-spinner fa-spin"></i>');
	jQuery.ajax({
		type: "POST",
		url: '',
		data:{
			'actionOnePage':'callAjaxMethod',
			'methodOnePage':'removeDomainToCart',
			'domain':domainName,
			'type':domaintype,
			'pidAdd':pidGet,
			'pidCount':pidcount,
		},
		success:function (data) {
			jQuery(obj).addClass("hidden");
			jQuery(obj).prev("button").removeClass("hidden");
			jQuery(obj).html(btntxt);
			jQuery(obj).attr('disabled', false);
			wgsDomainConfigureAddDomain();
			wgsLoadCheckoutPage();
		},                                 		         
	});
}
/***** function for domain configure *********/
function wgsDomainConfigureAddDomain(){
  jQuery(".domain-configration-container").addClass("hidden");
  jQuery(".domain-configration-container").html('');
  jQuery.post("cart.php?a=confdomains", '&ajax=1',
   function (data) {
		if(data != ''){
			jQuery(".domain-configration-container").html(data);
			jQuery(".domain-configration-container").removeClass("hidden");
		}
   });
    cartsummary();
}
/***** function for configure domains part ****/
function wgsConfigDomainOption() {
   var btnTxt = jQuery('a.con-btn').text();
   jQuery('a.con-btn').addClass("wgsDisable");
   jQuery('a.con-btn').html(btnTxt + ' <i class="fa fa-spinner fa-spin"></i>');
   var post = WHMCS.http.jqClient.post("cart.php", 'ajax=1&a=confdomains&' + jQuery("#frmConfigureDomains").serialize());
   post.done(
           function (data) {
                cartsummary();
				jQuery('a.con-btn').removeClass("wgsDisable");
				jQuery('a.con-btn').html(btnTxt); 
           }
   );  
}
/******** function for complete order **********/
function wgsCompleteOrderCheckout(obj,btntxt) {
   jQuery(obj).attr('disabled', true);
   jQuery(obj).html(btntxt + ' <i class="fa fa-spinner fa-spin"></i>');
   jQuery('#validation_error').removeClass('alert alert-danger').html('');
   jQuery.post("cart.php", 'actionOnePage=callAjaxMethod&methodOnePage=checkhostingdomain',
   function (data) {
	    if(data != ''){
		   jQuery('#validation_error').addClass('alert alert-danger').html('<ul>' + data + '</ul>');
		   jQuery('html, body').animate({scrollTop: jQuery("#validation_error").offset().top - 30}, 500);
			jQuery(obj).attr('disabled', false);
			jQuery(obj).html(btntxt);
	    }else{
		jQuery.post("cart.php", 'a=checkout&checkout=1&ajax=1&' + jQuery("#frmCheckout").serialize(),
		   function (data) {
			   if (data != '') {
				   jQuery('#validation_error').addClass('alert alert-danger').html('<ul>' + data + '</ul>');
				   jQuery('html, body').animate({scrollTop: jQuery("#validation_error").offset().top - 30}, 500);
				   jQuery(obj).attr('disabled', false);
				   jQuery(obj).html(btntxt);
			   } else {
				   window.location = 'cart.php?a=fraudcheck';
			   }
			});
	    }
    });
}
/********* function for manage domain on remove ********/
function wgsManageDomainButton(obj,domainName){
	jQuery(".wgs-d-modal").attr("remove-data-d",domainName);
}
/******** function for manage product on remove *******/
function wgsManageProductButton(obj,pid){
	jQuery(".wgs-d-modal").attr("remove-data-p",pid);
} 
/******* function for edit product configuration ******/
function wgsEditProductConfigOption(ival,pid){
	jQuery("#loaderSpinsBilling").removeClass("hidden");
	jQuery("input[name='productRadio']").removeAttr('checked');
	jQuery("#prod"+pid).prop("checked", true);
	jQuery('html, body').animate({
        scrollTop: jQuery(".choose-pla-wrapper").offset().top
    }, 1000);
	wgsGetProductConfigOption(ival);
}
/**** function for manage domain div ******/
function wgsDomainSectionManage(obj,callFor){
		jQuery(".wgs-choose-dms").toggleClass("hidden");
		jQuery(".registerDm").toggleClass("hidden");
		jQuery(".transferDm").toggleClass("hidden");
}
/***** function to manage pid and domain *****/
function wgsManagePidDomain(pid,pc){
		jQuery("#dpid").val(pid);
		jQuery("#pidcnt").val(pc);
		//jQuery("#btnDomainManages").prop("disabled",true);
		jQuery("#domainname").val('');
		jQuery(".wgs-choose-dms").removeClass("hidden");
		jQuery(".registerDm").removeClass("hidden");
		jQuery(".ownDm").removeClass("hidden");
		jQuery(".wgs-choose-dms").find("ul").find("li").first().find("input").trigger('click');
		jQuery(".input-search-container").removeClass("hidden");
		jQuery(".coose-domain-container").removeClass("hidden");
		jQuery("#productDomainMsg").html('');
		var productDomains = '';
		if(jQuery(".coose-domain-container").length > 0){
			productDomains = productHaveDomain;
		}else{
			productDomains = productHaveDomain+askAdminForEnable;
		}
		jQuery("#productDomainMsg").html('<p>'+productDomains+'</p>');
		jQuery("#productDomainMsg").removeClass("hidden");
		setTimeout(function() { 
			jQuery("#productDomainMsg").addClass("hidden");
			jQuery("#productDomainMsg").html('');
			if(jQuery(".coose-domain-container").length > 0) {
				jQuery('html, body').animate({
					scrollTop: jQuery(".coose-domain-container").offset().top
				}, 1000);
			}
		}, 2000);	
}
/******* function for change domain aftre assigned ********/
function wgsUpdateProductDomian(obj,icounter){
	var domainName = jQuery(obj).val();
	if(domainName != '0'){
		jQuery.ajax({
			type: "POST",
			url: '',
			data:{
				'actionOnePage':'callAjaxMethod',
				'methodOnePage':'switchAssignedProductDomain',
				'counterProdutc':icounter,
				'domainName':domainName,
			},
			success:function (data) {
				wgsDomainConfigureAddDomain();
				wgsCallAjaxForConfigureProduct();
				wgsLoadCheckoutPage();
				cartsummary();
			},                                 		         
		});
	}	
}