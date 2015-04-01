<?php

$_GET["keywords"] = urlencode($_GET["keywords"]);

$xml_query = 'http://svcs.ebay.com/services/search/FindingService/v1?siteid=0&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=Universi-599d-4cbd-b112-4d2624ef5a28&RESPONSE-DATA-FORMAT=XML';
$xml_query .= '&keywords=' . $_GET["keywords"];
$xml_query .= '&sortOrder=' . $_GET["sortOrder"];
$xml_query .= '&paginationInput.entriesPerPage=' . $_GET["entriesPerPage"];
$xml_query .= '&paginationInput.pageNumber=' . $_GET["pageNum"];

$xml_query .= '&outputSelector[0]=SellerInfo&outputSelector[1]=PictureURLSuperSize&outputSelector[2]=StoreInfo';

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

$ebayXML = simplexml_load_file($xml_query);

$json_result = [];
$json_result["ack"] = (string) $ebayXML->ack;
$json_result["itemCount"] = (int) $ebayXML->paginationOutput->entriesPerPage;
$json_result["pageNumber"] = (int) $ebayXML->paginationOutput->pageNumber;
$json_result["resultCount"] = (int) $ebayXML->paginationOutput->totalEntries;

$itemCount = 0;
foreach ($ebayXML->searchResult->item as $item) {
	$item_array = [];
	$basicInfo = [];
	$sellerInfo = [];
	$shippingInfo = [];

	$basicInfo["title"] = (string) $item->title;
	$basicInfo["viewItemURL"] = (string)$item->viewItemURL;
	$basicInfo["galleryURL"] = (string)$item->galleryURL;
	$basicInfo["pictureURLSuperSize"] = (string)$item->pictureURLSuperSize;
	$basicInfo["convertedCurrentPrice"] = (float)$item->sellingStatus->convertedCurrentPrice;
	$basicInfo["shippingServiceCost"] = (float)$item->shippingInfo->shippingServiceCost;
	$basicInfo["conditionDisplayName"] = (string)$item->condition->conditionDisplayName;
	$basicInfo["listingType"] = (string)$item->listingInfo->listingType;
	$basicInfo["location"] = (string)$item->location;
	$basicInfo["categoryName"] = (string)$item->primaryCategory->categoryName;
	$basicInfo["topRatedListing"] = (string)$item->topRatedListing;
	
	$sellerInfo["sellerUserName"] = (string)$item->sellerInfo->sellerUserName;
	$sellerInfo["feedbackScore"] = (float)$item->sellerInfo->feedbackScore;
	$sellerInfo["positiveFeedbackPercent"] = (float)$item->sellerInfo->positiveFeedbackPercent;
	$sellerInfo["feedbackRatingStar"] = (bool)$item->sellerInfo->topRatedSeller;
	$sellerInfo["sellerStoreName"] = (string)$item->storeInfo->storeName;
	$sellerInfo["sellerStoreURL"] = (string)$item->storeInfo->storeURL;
		
	$shippingInfo["shippingType"] = (string)$item->shippingInfo->shippingType;
	$shipToLocations = [];
	$locations = json_decode(json_encode($item->shippingInfo->shipToLocations));
	foreach ($locations as $location) {
		$shipToLocations[] = (string)$location;
	}
	$shippingInfo["shipToLocations"] = $shipToLocations;
	$shippingInfo["expeditedShipping"] = (bool)$item->shippingInfo->expeditedShipping;
	$shippingInfo["oneDayShippingAvailable"] = (bool)$item->shippingInfo->oneDayShippingAvailable;
	$shippingInfo["returnsAccepted"] = (bool)$item->returnsAccepted;
	$shippingInfo["handlingTime"] = (int)$item->shippingInfo->handlingTime;
	
	$item_array["basicInfo"] = $basicInfo;
	$item_array["sellerInfo"] = $sellerInfo;
	$item_array["shippingInfo"] = $shippingInfo;

	$json_result["item" . $itemCount++] = $item_array;
}

$json_result["query"] = $xml_query;

echo json_encode($json_result);

?>