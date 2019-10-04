
//Check production or development....
export const is_production = true;





let currentURL = "";
let arrResult = null;

if(!is_production){
	currentURL = "http://localhost/wp_cybetiq/self-quotation-system/wp-admin/admin.php?page=csq-main";
	arrResult = currentURL.split("wp-admin");
}else{
	currentURL = window.location.href;
	arrResult = currentURL.split("wp-content/plugins");
}

let SITE_URL = arrResult[0];
let AJAX_URL = SITE_URL + "wp-admin/admin-ajax.php";

let AJAX_GET_ALL_BOXES = AJAX_URL+"?action=getAllBoxes";
let AJAX_SUBMIT_CONTACT_DATA = AJAX_URL+"?action=postSubmitContact";

let PLUGIN_ASSET_URL = SITE_URL+"wp-content/plugins/cybetiq-self-quotation-system/init-app/resources/";

export default {
    PLUGIN_ASSET_URL,
    SITE_URL,
    AJAX_URL,
    AJAX_GET_ALL_BOXES,
    AJAX_SUBMIT_CONTACT_DATA
};
