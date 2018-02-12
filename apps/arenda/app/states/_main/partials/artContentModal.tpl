<md-dialog flex = "80">
	<md-dialog-header>
		<md-toolbar class = "md-accent md-hue-2">
			<div class = "md-toolbar-tools">
				<small> {{vm.item.subject}} </small>
				<span flex></span>
				
				<md-button class = "md-icon-button" ng-click = "vm.close()">
					<md-icon md-svg-icon = "navigation:ic_close_24px"></md-icon>
				</md-button>
			</div>
		</md-toolbar>
	</md-dialog-header>
	<md-dialog-content class = "md-padding">
<!--		<div layout = "row">
			<span flex></span>
			<small class = "blue">{{vm.item.date}}</small>
		</div>
		<md-divider></md-divider>-->
		{{vm.item.abstract}}
		<br>
		<span ng-bind-html="vm.item.content"></span>
		
	</md-dialog-content>
</md-dialog>