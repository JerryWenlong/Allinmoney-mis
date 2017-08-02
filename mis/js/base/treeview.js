(function ( angular ) {
	'use strict';

	angular.module( 'treeview', [] ).directive( 'treeModel', ['$compile', '$window',function( $compile, $window ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var treeId = attrs.treeId;
			
				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				//bind end child click function
				var endClick = attrs.endClick || '';

				//checkbox
				var ableCheckbox = attrs.ableCheckbox || false;

				//check
				var checkItem = attrs.checkItem || 'checked';

				var checkTemplate = '';
				if(ableCheckbox == 'true'){
					checkTemplate = '<input type="checkbox" class="" ng-model="node.'+checkItem+'" data-ng-change=" ' + treeId + '.selectChange(node)" data-ng-checked="'+treeId+'.checkStatus(node)"></input>';
				}
				//tree template
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + treeModel + '">' +
							checkTemplate+
							'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
							'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
							'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-able-checkbox=' + ableCheckbox + ' ></div>' +
						'</li>' +
					'</ul>';


				//check tree id, tree model
				if( treeId && treeModel ) {
					//root node
					if( attrs.treeview ) {
						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;

							//end click
							if(endClick != ''){
								scope[endClick](selectedNode);
							}
							
							
						};


						//if node checked or unchecked
						scope[treeId].checkStatus = scope[treeId].checkStatus||function(selectedNode){	
							var children = selectedNode.children;
							var len = children.length;
							if(len>0){
								var status = true;
								for(var i=0;i<len;i++){
									var item = children[i];
									if(item.checked == false){
										status = false;
										break;
									}
								}
								selectedNode[checkItem] = status;
							}
							return selectedNode[checkItem];
						}

						scope[treeId].selectChange = scope[treeId].selectChange || function(selectedNode, $event){
							// debugger;
							function change(node, status){
								if(node.children.length > 0){
									node.children.forEach(function(node){
										change(node, status)
									});
								}
								node[checkItem] = status;
							}
							var children = selectedNode.children;
							var len = children.length;
							var currentStatus = selectedNode[checkItem];
							if(len>0){
								children.forEach(function(node){
									change(node, currentStatus)
								})
							}
						}

					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
