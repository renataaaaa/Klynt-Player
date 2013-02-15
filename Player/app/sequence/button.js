/**
 * Copyright 2013, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 */
 
function addButton(data) {
	addButton_old('#' + SEQUENCE.container.id, data.id, data.label, data.label, data.databegin, data.dataend, data.duration, '', '', '', data.left, data.top, data.type, '', '', data.width, data.height, data.link, data.zIndex, data.transitionIn, data.transitionOut);
}

function addButton_old(seqId, btnID, label, tooltip, databegin, dataend, duration, onbegin, onend, onclick, left, top, type, onmouseover, onmouseout, width, height, lnk, btnZindex, animationIn, animationOut) {

	function createButton() {
		var btn = document.createElement('button');
		btn.id = btnID;
		btn.innerHTML = label;
		btn.title = tooltip || null;
		btn.className = type;
		btn.setAttribute('name', 'button');

		/* Transistions */
		if (animationIn && animationIn != 'null') {

			switch (animationIn.type) {
				case 'fade' :
					onbegin = "elementFadeIn('" + btnID + "', 1 ," + animationIn.duration + ");" + onbegin;
					break;
				case 'barWipe' :
					onbegin = onbegin + "elementBarWipeIn('" + btnID + "'," + left + "," + animationIn.duration + ");";
					onend = onend + "setLeftPosition('" + btnID + "', 0);";
					break;
			}
		}
		if (animationOut && animationOut != 'null') {
			switch (animationOut.type) {
				case 'fade' :
					var animate = 'elementFadeOut(\'' + btnID + '\',' + animationOut.duration + ');';
					break;
				case 'barWipe' :
					var animate = 'elementBarWipeOut(\'' + btnID + '\',' + animationOut.duration + ')';
					break;
			}
			SEQUENCE.addMetaElement(getTransitionBegin(dataend, animationOut.duration), animate);
		}
		onbegin = 'resetTransitionOut(\'' + btnID + '\',1,' + left + ');' + onbegin;
		setCommonAttributes(btn);
		$(seqId).append(btn);
		$(seqId).append('<br />');
		return btn;
	}


	function createArrow(arrow_type) {
		var container = document.createElement('div');
		container.className = 'btn-arrow_container';
		container.title = tooltip || null;
		container.setAttribute('name', 'button_arrow_container');
		container.id = "_" + btnID;
		setCommonAttributes(container);

		var arrow = document.createElement('div');
		arrow.id = btnID;
		arrow.setAttribute('name', 'button_arrow');
		arrow.className = type;

		var tooltip = document.createElement('div');
		tooltip.id = btnID + arrow_type;
		tooltip.className = type + '_tooltip';
		tooltip.setAttribute('name', 'button_arrow_tooltipe');
		tooltip.style.display = "none";
		tooltip.innerHTML = label;

		arrow.setAttribute('onmouseover', "mouseOut('" + tooltip.id + "')");
		arrow.setAttribute('onmouseout', "mouseOver('" + tooltip.id + "')");

		$(seqId).append(container);
		$(container).append(arrow);
		$(container).append(tooltip);

		$(seqId).append('<br/>');

		tooltip.style.width = getWidth(container) - getWidth(arrow) - getHorizontalPadding(tooltip) + 'px';

		return arrow;
	}


	function getWidth(element) {
		return getStyle(element, 'width');
	}

	function getHorizontalPadding(element) {
		return getStyle(element, 'paddingLeft') + getStyle(element, 'paddingRight');
	}

	function getStyle(element, style) {
		return parseInt(window.getComputedStyle(element)[style], 10);
	}

	function setCommonAttributes(root_element) {

		setLayout(root_element);
		setTiming(root_element);
		attachLink(root_element);
	}

	function setLayout(root_element) {
		root_element.style.zIndex = btnZindex;

		root_element.style.position = 'absolute';
		root_element.style.top = top + 'px';
		root_element.style.left = left + 'px';
		root_element.style.width = width + 'px';
		root_element.style.height = height + 'px';
			
		// Elements are initially hidden until they become active.
		root_element.style.visibility = 'hidden';
	}


	function setTiming(root_element) {
		root_element.setAttribute('data-begin', databegin);
		root_element.setAttribute('data-end', dataend);
		root_element.setAttribute('data-dur', duration);
		root_element.setAttribute('data-onbegin', onbegin);
		root_element.setAttribute('data-onend', onend);

	}

	function attachLink(root_element) {
		if (!lnk)
			return;

		root_element.linkData = lnk;
		
		root_element.title = lnk.tooltip || null;

		if (lnk.automaticTransition) {
			root_element.style.display = 'none';
			SEQUENCE.automaticLink = lnk;
			root_element.setAttribute('data-onbegin', "SEQUENCE.executeEnd();");
		} else {
			root_element.style.cursor = "pointer";
			root_element.setAttribute('onclick', "SEQUENCE.runLink('" + root_element.id + "');");
		}
		return root_element;
	}

	function createButtonByType(type) {
		switch (type) {
			case 'btn-arrow-left':
				createArrow('left');
				break;
			case 'btn-arrow-right':
				createArrow('right');
				break;
			case 'btn-arrow-top':
				createArrow('top');
				break;
			case 'btn-arrow-bottom':
				createArrow('bottom');
				break;
			default:
				createButton();
		}
	}

	createButtonByType(type);
}

function mouseOut(id) {
	var myTooltip = document.getElementById(id).id;
	$('#' + myTooltip).fadeIn(500, "swing");
}

function mouseOver(id) {
	var myTooltip = document.getElementById(id).id;
	$('#' + myTooltip).fadeOut(500, "swing");
}