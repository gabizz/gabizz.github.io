<md-card class="md-whiteframe-z4 " style="border-radius:10px; opacity:0.95;">
    <md-card-title layout-align="center">
        <div class="md-card-title-text">
            <H2>AUTENTIFICARE</H2>
        </div>
    </md-card-title>
    <md-card-content layout="column">

        <form name="clientLogin" layout="column" layout-fill flex="100">

            <md-card style="opacity:1;" layout-padding class="md-whiteframe-z3" layout="column">
                <span flex="10"></span>
                <div section layout="row" flex layout-align="center center">



                    <md-input-container flex="100">
                        <md-icon md-svg-icon="action:ic_face_24px"> </md-icon>
                        <input ng-model="user.username" name="userName" type="text" placeholder="Nume utilizator" required style="font-size:18px; font-weight:bold">
                        <div ng-messages="user.username.$error">
                            <div ng-message="required">utilizarul este obligatoriu</div>
                        </div>
                    </md-input-container>

                </div>


                <div section layout="row" flex layout-align="center center">


                    <md-input-container flex="100">
                        <!--                        <md-icon md-svg-icon="action:ic_account_circle_24px"> </md-icon>-->
                        <md-icon md-svg-icon="communication:ic_vpn_key_24px"> </md-icon>
                        <input type="password" ng-model="user.password" type="text" placeholder="Parola" required name="userPassword" style="font-size:18px; font-weight:bold" ng-keyup="$event.keyCode == 13 && vm.submit(user)">
                        <div ng-messages="userPassword.$error">
                            <div ng-message="required">parola este obligatorie</div>
                        </div>
                    </md-input-container>

                </div>
                <span flex="10"></span>
            </md-card>
        </form>
    </md-card-content>
    <md-card-actions layout="row" layout-align="center center">
        <md-button class="md-accent md-hue-3" ng-click="vm.submit(user)" ng-disabled="clientLogin.$invalid" aria-label="login button">

            <md-icon md-svg-icon="action:ic_check_circle_24px" style="height:5vw; width:5vw"></md-icon>
        </md-button>
    </md-card-actions>
</md-card>