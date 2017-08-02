(function(angular){
	'use strict';
	angular.module('foldingNavBar', []).directive('foldingNavmodel', ['$compile', '$window', function($compile, $window){
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var navId = attrs.navId;
			
				//tree model
				var navModel = attrs.foldingNavmodel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				//parent
				var nodeParent = attrs.nodeParent || 'parent';

				//icon
				var iconClass = attrs.iconClass || 'icon';

				//bind end child click function
				var endClick = attrs.endClick || '';

				//tree template
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + navModel + '">' +
							'<div data-ng-class="{head:!node.'+ nodeParent +', item:node.'+ nodeParent +' ,selected:'+navId+'.checkSelect(node) }" data-ng-click="'+navId+'.selectNodeHead(node)">' +
								'<span class="icon-before" data-ng-show="!node.'+ nodeParent +'"><span class="icon {{node.'+iconClass+'}}"></span></span>' +
								'<span class="label-text">{{node.' + nodeLabel + '}}</span>' +
								'<span class="icon-end" data-ng-show="!node.'+ nodeParent +'" data-ng-class="{expanded:node.expanded}">&#62</span>' +
							'</div>' +
							'<div class="child-list" data-ng-hide="!node.expanded" data-nav-id="' + navId + '" data-folding-navmodel="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + ' ></div>' +
						'</li>' +
					'</ul>';


				//check tree id, tree model
				if( navId && navModel ) {
					//root node
					if( attrs.floadingNav ) {
						//create tree object if not exists
						scope[navId] = scope[navId] || {};

						scope[navId].checkSelect = scope[navId].checkSelect || function(selectedNode){
							var childSelected = false;
							for (var i=0; i<selectedNode[nodeChildren].length;i++){
								var node = selectedNode[nodeChildren][i];
								if(node.selected == 'selected'){
									childSelected = true;
									break;
								}
							}
							return (selectedNode.selected == 'selected') || childSelected
						};

						//if node head clicks,
						scope[navId].selectNodeHead = scope[navId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.expanded = !selectedNode.expanded;

							//remove highlight from previous node
							if( scope[navId].currentNode && scope[navId].currentNode.selected ) {
								scope[navId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[navId].currentNode = selectedNode;

							//end click
							if(endClick != ''){
								if(selectedNode.children.length <= 0){
									scope[endClick](selectedNode);
								}
							}

						};

					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		}
	}]);
})(angular)