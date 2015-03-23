<?php

$_GET["keywords"] = urlencode($_GET["keywords"]);

$xml_query = 'http://svcs.ebay.com/services/search/FindingService/v1?siteid=0&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Universi-599d-4cbd-b112-4d2624ef5a28&RESPONSE-DATA-FORMAT=XML';
$xml_query .= '&keywords=' . $_GET["keywords"];
$xml_query .= '&sortOrder=' . $_GET["sortOrder"];
$xml_query .= '&paginationInput.entriesPerPage=' . $_GET["entriesPerPage"];

$counter = 0;

if(isset($_GET["MinPrice"]) && $_GET["MinPrice"] != '') {
	$xml_query .= '&itemFilter(' . $counter . ').name=MinPrice&itemFilter(' . $counter . ').value=' . $_GET["MinPrice"];
	$counter += 1;
}

if(isset($_GET["MaxPrice"]) && $_GET["MaxPrice"] != '') {
	$xml_query .= '&itemFilter(' . $counter . ').name=MaxPrice&itemFilter(' . $counter . ').value=' . $_GET["MaxPrice"];
	$counter += 1;
}

if(isset($_GET["New"]) || isset($_GET["Used"]) || isset($_GET["Good"]) || isset($_GET["VeryGood"]) || isset($_GET["Acceptable"])) {
	$valuecount = 0;
	if(isset($_GET["New"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=Condition&itemFilter(' . $counter . ').value['. $valuecount . ']=1000';
		$valuecount++;
	}
	if(isset($_GET["Used"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=Condition&itemFilter(' . $counter . ').value['. $valuecount . ']=3000';
		$valuecount++;
	}
	if(isset($_GET["Good"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=Condition&itemFilter(' . $counter . ').value['. $valuecount . ']=5000';
		$valuecount++;
	}
	if(isset($_GET["VeryGood"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=Condition&itemFilter(' . $counter . ').value['. $valuecount . ']=4000';
		$valuecount++;
	}
	if(isset($_GET["Acceptable"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=Condition&itemFilter(' . $counter . ').value['. $valuecount . ']=6000';
		$valuecount++;
	}
	$counter += 1;
}

if(isset($_GET["FixedPrice"]) || isset($_GET["Auction"]) || isset($_GET["Classified"])) {
	$valuecount = 0;
	if(isset($_GET["FixedPrice"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=ListingType&itemFilter(' . $counter . ').value['. $valuecount . ']=FixedPrice';
		$valuecount += 1;
	}

	if(isset($_GET["Auction"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=ListingType&itemFilter(' . $counter . ').value['. $valuecount . ']=Auction';
		$valuecount += 1;
	}

	if(isset($_GET["Classified"])) {
		$xml_query .= '&itemFilter(' . $counter . ').name=ListingType&itemFilter(' . $counter . ').value['. $valuecount . ']=Classified';
		$valuecount += 1;
	}
	$counter += 1;
}

if(isset($_GET["ReturnsAcceptedOnly"])) {
	$xml_query .= '&itemFilter(' . $counter . ').name=ReturnsAcceptedOnly&itemFilter(' . $counter . ').value=true';
	$counter += 1;
}

if(isset($_GET["FreeShippingOnly"])) {

	$xml_query .= '&itemFilter(' . $counter . ').name=FreeShippingOnly&itemFilter(' . $counter . ').value=true';
	$counter += 1;
}

if(isset($_GET["ExpeditedShippingType"])) {
	$xml_query .= '&itemFilter(' . $counter . ').name=ExpeditedShippingType&itemFilter(' . $counter . ').value=Expedited';
	$counter += 1;
}

if(isset($_GET["MaxHandlingTime"]) && $_GET["MaxHandlingTime"] != '') {
	$xml_query .= '&itemFilter(' . $counter . ').name=MaxHandlingTime&itemFilter(' . $counter . ').value=' . $_GET["MaxHandlingTime"];
	$counter += 1;
}

$xml_result = simplexml_load_file($xml_query);
$json_result = json_encode($xml_result);

echo $json_result;

?>