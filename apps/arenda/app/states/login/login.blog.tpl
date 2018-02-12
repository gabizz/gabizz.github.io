	<!--	NOUTATI-->
<md-card class="md-whiteframe-z4 md-padding" style="border-radius:10px; opacity:0.9" >
		<!--		<div layout = "row" layout-align = "center" style = "border-bottom:5px solid #E1E1E1"> <strong>NOUTĂȚI</strong> </div>-->
		<div layout="row" flex>
			<md-content flex="100" layout="column" style="padding:0; margin:0">
				<!--			{{vm.blog}}-->
				<md-content layout="column" flex>
					<md-list>
						<md-list-item class="md-dense md-2-line" ng-repeat="art in vm.blog | orderBy: 'date': -1" ng-if="art.published == true" ng-click="vm.articleContent(art)">
							<section layout="row" flex>
								<small><i><strong>{{art.date*1000 |date:"dd.MM.yyyy"}}</strong></i></small> &nbsp; &nbsp;
								<div class="md-list-item-text">

									<strong><small style = 'color:red'>{{art.subject}}</small></strong>

									<p><small>{{art.abstract}}</small></p>
								</div>
							</section>
							<md-divider></md-divider>
						</md-list-item>
					</md-list>

				</md-content>


			</md-content>

	</div>
</md-card>