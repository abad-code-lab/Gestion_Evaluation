import React from 'react';
// import AccueilCandidat from "./AccueilCandidat";
import Header from "./Header";
import SideBar from "./SideBar";
import Footer from './Footer';

const Cadreur = () => {
    return (

        // <div className="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 2-columns   " data-open="click" data-menu="vertical-dark-menu" data-col="2-columns">
        <div>
            <Header />
            <SideBar />

            {/* <AccueilCandidat /> */}

            <div id="main">
                <div className="row">
                    <div className="col s12">
                        <div className="container">
                            <div className="section">

                                <div id="card-stats" className="pt-0">
                                    <div className="row">
                                        <div className="col s12 m6 l6 xl3">
                                            <div className="card gradient-45deg-light-blue-cyan gradient-shadow min-height-100 white-text animate fadeLeft">
                                                <div className="padding-4">
                                                    <div className="row">
                                                        <div className="col s7 m7">
                                                            <i className="material-icons background-round mt-5">add_shopping_cart</i>
                                                            <p>Orders</p>
                                                        </div>
                                                        <div className="col s5 m5 right-align">
                                                            <h5 className="mb-0 white-text">690</h5>
                                                            <p className="no-margin">New</p>
                                                            <p>6,00,00</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m6 l6 xl3">
                                            <div className="card gradient-45deg-red-pink gradient-shadow min-height-100 white-text animate fadeLeft">
                                                <div className="padding-4">
                                                    <div className="row">
                                                        <div className="col s7 m7">
                                                            <i className="material-icons background-round mt-5">perm_identity</i>
                                                            <p>Clients</p>
                                                        </div>
                                                        <div className="col s5 m5 right-align">
                                                            <h5 className="mb-0 white-text">1885</h5>
                                                            <p className="no-margin">New</p>
                                                            <p>1,12,900</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m6 l6 xl3">
                                            <div className="card gradient-45deg-amber-amber gradient-shadow min-height-100 white-text animate fadeRight">
                                                <div className="padding-4">
                                                    <div className="row">
                                                        <div className="col s7 m7">
                                                            <i className="material-icons background-round mt-5">timeline</i>
                                                            <p>Sales</p>
                                                        </div>
                                                        <div className="col s5 m5 right-align">
                                                            <h5 className="mb-0 white-text">80%</h5>
                                                            <p className="no-margin">Growth</p>
                                                            <p>3,42,230</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m6 l6 xl3">
                                            <div className="card gradient-45deg-green-teal gradient-shadow min-height-100 white-text animate fadeRight">
                                                <div className="padding-4">
                                                    <div className="row">
                                                        <div className="col s7 m7">
                                                            <i className="material-icons background-round mt-5">attach_money</i>
                                                            <p>Profit</p>
                                                        </div>
                                                        <div className="col s5 m5 right-align">
                                                            <h5 className="mb-0 white-text">$890</h5>
                                                            <p className="no-margin">Today</p>
                                                            <p>$25,000</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="sales-chart">
                                    <div className="row">
                                        <div className="col s12 m8 l8">
                                            <div id="revenue-chart" className="card animate fadeUp">
                                                <div className="card-content">
                                                    <h4 className="header mt-0">
                                                        REVENUE FOR 2020
                                                        <span className="purple-text small text-darken-1 ml-1">
                                                            <i className="material-icons">keyboard_arrow_up</i> 15.58 %</span>
                                                        <a className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow right">Details</a>
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col s12">
                                                            <div className="yearly-revenue-chart">
                                                                <canvas id="thisYearRevenue" className="firstShadow" height="350"></canvas>
                                                                <canvas id="lastYearRevenue" height="350"></canvas>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m4 l4">
                                            <div id="weekly-earning" className="card animate fadeUp">
                                                <div className="card-content">
                                                    <h4 className="header m-0">Earning <i className="material-icons right grey-text lighten-3">more_vert</i></h4>
                                                    <p className="no-margin grey-text lighten-3 medium-small">Mon 15 - Sun 21</p>
                                                    <h3 className="header">$899.39 <i className="material-icons deep-orange-text text-accent-2">arrow_upward</i>
                                                    </h3>
                                                    <canvas id="monthlyEarning" className="" height="150"></canvas>
                                                    <div className="center-align">
                                                        <p className="lighten-3">Total Weekly Earning</p>
                                                        <a className="waves-effect waves-light btn gradient-45deg-purple-deep-orange gradient-shadow">View
                                                            Full</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="daily-data-chart">
                                    <div className="row">
                                        <div className="col s12 m4 l4">
                                            <div className="card pt-0 pb-0 animate fadeLeft">
                                                <div className="dashboard-revenue-wrapper padding-2 ml-2">
                                                    <span className="new badge gradient-45deg-light-blue-cyan gradient-shadow mt-2 mr-2">+ 42.6%</span>
                                                    <p className="mt-2 mb-0">Members online</p>
                                                    <p className="no-margin grey-text lighten-3">360 avg</p>
                                                    <h5>3,450</h5>
                                                </div>
                                                <div
                                                    className="sample-chart-wrapper"
                                                    style={{ marginBottom: "-14px", marginTop: "-75px" }}
                                                >

                                                    <canvas id="custom-line-chart-sample-one" className="center"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m4 l4 animate fadeUp">
                                            <div className="card pt-0 pb-0">
                                                <div className="dashboard-revenue-wrapper padding-2 ml-2">
                                                    <span className="new badge gradient-45deg-purple-deep-orange gradient-shadow mt-2 mr-2">+ 12%</span>
                                                    <p className="mt-2 mb-0">Current server load</p>
                                                    <p className="no-margin grey-text lighten-3">23.1% avg</p>
                                                    <h5>+2500</h5>
                                                </div>
                                                <div
                                                    className="sample-chart-wrapper"
                                                    style={{ marginBottom: "-14px", marginTop: "-75px" }}
                                                >

                                                    <canvas id="custom-line-chart-sample-two" className="center"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m4 l4">
                                            <div className="card pt-0 pb-0 animate fadeRight">
                                                <div className="dashboard-revenue-wrapper padding-2 ml-2">
                                                    <span className="new badge gradient-45deg-amber-amber gradient-shadow mt-2 mr-2">+ $900</span>
                                                    <p className="mt-2 mb-0">Today's revenue</p>
                                                    <p className="no-margin grey-text lighten-3">$40,512 avg</p>
                                                    <h5>$ 22,300</h5>
                                                </div>
                                                <div
                                                    className="sample-chart-wrapper"
                                                    style={{ marginBottom: "-14px", marginTop: "-75px" }}
                                                >

                                                    <canvas id="custom-line-chart-sample-three" className="center"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="ecommerce-product">
                                    <div className="row">
                                        <div className="col s12 m4">
                                            <div className="card animate fadeLeft">
                                                <div className="card-content  center">
                                                    <h6 className="card-title font-weight-400 mb-0">Apple Watch</h6>
                                                    <img src="app-assets/images/cards/watch.png" alt="" className="responsive-img" />
                                                    <p><b>The Apple Watch</b></p>
                                                    <p>One day only exclusive sale on our marketplace</p>
                                                </div>
                                                <div className="card-action border-non center">
                                                    <a className="waves-effect waves-light btn gradient-45deg-light-blue-cyan box-shadow">$ 999/-</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m4">
                                            <div className="card animate fadeUp">
                                                <div className="card-content center">
                                                    <span className="card-title center-align">Music</span>
                                                    <img src="app-assets/images/cards/headphones-2.png" alt="" className="responsive-img" />
                                                </div>
                                                <div className="card-action pt-0">
                                                    <p className="">Default Quality</p>
                                                    <div className="chip">192kb <i className="close material-icons">close</i></div>
                                                    <div className="chip">320kb <i className="close material-icons">close</i></div>
                                                </div>
                                                <div className="card-action pt-0">
                                                    <p className="">Save Video Quality</p>
                                                    <div className="switch">
                                                        <label> Off <input type="checkbox" /> <span className="lever"></span> On </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s12 m4">
                                            <div className="card animate fadeRight">
                                                <div className="card-content center">
                                                    <h6 className="card-title font-weight-400 mb-0">iPhone</h6>
                                                    <img src="app-assets/images/cards/iphonec.png" alt="" className="responsive-img" />
                                                    <p><b>The Apple iPhone X</b></p>
                                                    <p>One day only exclusive sale on our marketplace</p>
                                                </div>
                                                <div className="card-action border-non center">
                                                    <a className="waves-effect waves-light btn gradient-45deg-red-pink box-shadow">$ 299/-</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="ecommerce-offer">
                                        <div className="row">
                                            <div className="col s12 m3">
                                                <div className="card gradient-shadow gradient-45deg-light-blue-cyan border-radius-3 animate fadeUp">
                                                    <div className="card-content center">
                                                        <img src="app-assets/images/icon/apple-watch.png" className="width-40 border-round z-depth-5 responsive-img" alt="image" />
                                                        <h5 className="white-text lighten-4">50% Off</h5>
                                                        <p className="white-text lighten-4">On apple watch</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col s12 m3">
                                                <div className="card gradient-shadow gradient-45deg-red-pink border-radius-3 animate fadeUp">
                                                    <div className="card-content center">
                                                        <img src="app-assets/images/icon/printer.png" className="width-40 border-round z-depth-5 responsive-img" alt="images" />
                                                        <h5 className="white-text lighten-4">20% Off</h5>
                                                        <p className="white-text lighten-4">On Canon Printer</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col s12 m3">
                                                <div className="card gradient-shadow gradient-45deg-amber-amber border-radius-3 animate fadeUp">
                                                    <div className="card-content center">
                                                        <img src="app-assets/images/icon/laptop.png" className="width-40 border-round z-depth-5 responsive-img" alt="image" />
                                                        <h5 className="white-text lighten-4">40% Off</h5>
                                                        <p className="white-text lighten-4">On apple macbook</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col s12 m3">
                                                <div className="card gradient-shadow gradient-45deg-green-teal border-radius-3 animate fadeUp">
                                                    <div className="card-content center">
                                                        <img src="app-assets/images/icon/bowling.png" className="width-40 border-round z-depth-5 responsive-img" alt="image" />
                                                        <h5 className="white-text lighten-4">60% Off</h5>
                                                        <p className="white-text lighten-4">On any game</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <aside id="right-sidebar-nav">
                                <div id="slide-out-right" className="slide-out-right-sidenav sidenav rightside-navigation">
                                    <div className="row">
                                        <div className="slide-out-right-title">
                                            <div className="col s12 border-bottom-1 pb-0 pt-1">
                                                <div className="row">
                                                    <div className="col s2 pr-0 center">
                                                        <i className="material-icons vertical-text-middle"><a href="#" className="sidenav-close">clear</a></i>
                                                    </div>
                                                    <div className="col s10 pl-0">
                                                        <ul className="tabs">
                                                            <li className="tab col s4 p-0">
                                                                <a href="#messages" className="active">
                                                                    <span>Messages</span>
                                                                </a>
                                                            </li>
                                                            <li className="tab col s4 p-0">
                                                                <a href="#settings">
                                                                    <span>Settings</span>
                                                                </a>
                                                            </li>
                                                            <li className="tab col s4 p-0">
                                                                <a href="#activity">
                                                                    <span>Activity</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-out-right-body row pl-3">
                                            <div id="messages" className="col s12 pb-0">
                                                <div className="collection border-none mb-0">
                                                    <input className="header-search-input mt-4 mb-2" type="text" name="Search" placeholder="Search Messages" />
                                                    <ul className="collection right-sidebar-chat p-0 mb-0">
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Elizabeth Elliott</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Thank you</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">5.00 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-1.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Mary Adams</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Hello Boo</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">4.14 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-2.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Caleb Richards</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Hello Boo</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">4.14 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-3.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Caleb Richards</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Keny !</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">9.00 PM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-4.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">June Lane</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Ohh God</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">4.14 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-5.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Edward Fletcher</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Love you</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">5.15 PM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-6.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Crystal Bates</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Can we</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">8.00 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Nathan Watts</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Great!</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">9.53 PM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-8.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Willard Wood</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Do it</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">4.20 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-1.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Ronnie Ellis</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Got that</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">5.20 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-9.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Daniel Russell</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Thank you</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">12.00 AM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-10.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Sarah Graves</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Okay you</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">11.14 PM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-off avatar-50"><img src="app-assets/images/avatar/avatar-11.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Andrew Hoffman</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Can do</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">7.30 PM</span>
                                                        </li>
                                                        <li className="collection-item right-sidebar-chat-item sidenav-trigger display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                            <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-12.png" alt="avatar" />
                                                                <i></i>
                                                            </span>
                                                            <div className="user-content">
                                                                <h6 className="line-height-0">Camila Lynch</h6>
                                                                <p className="medium-small blue-grey-text text-lighten-3 pt-3">Leave it</p>
                                                            </div>
                                                            <span className="secondary-content medium-small">2.00 PM</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div id="settings" className="col s12">
                                                <p className="setting-header mt-8 mb-3 ml-5 font-weight-900">GENERAL SETTINGS</p>
                                                <ul className="collection border-none">
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Notifications</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input checked="" type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Show recent activity</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Show recent activity</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Show Task statistics</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Show your emails</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Email Notifications</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input checked="" type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p className="setting-header mt-7 mb-3 ml-5 font-weight-900">SYSTEM SETTINGS</p>
                                                <ul className="collection border-none">
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>System Logs</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Error Reporting</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Applications Logs</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input checked="" type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Backup Servers</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="collection-item border-none">
                                                        <div className="m-0">
                                                            <span>Audit Logs</span>
                                                            <div className="switch right">
                                                                <label>
                                                                    <input type="checkbox" />
                                                                    <span className="lever"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div id="activity" className="col s12">
                                                <div className="activity">
                                                    <p className="mt-5 mb-0 ml-5 font-weight-900">SYSTEM LOGS</p>
                                                    <ul className="widget-timeline mb-0">
                                                        <li className="timeline-items timeline-icon-green active">
                                                            <div className="timeline-time">Today</div>
                                                            <h6 className="timeline-title">Homepage mockup design</h6>
                                                            <p className="timeline-text">Melissa liked your activity.</p>
                                                            <div className="timeline-content orange-text">Important</div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-cyan active">
                                                            <div className="timeline-time">10 min</div>
                                                            <h6 className="timeline-title">Melissa liked your activity Drinks.</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content green-text">Resolved</div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-red active">
                                                            <div className="timeline-time">30 mins</div>
                                                            <h6 className="timeline-title">12 new users registered</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content">
                                                                <img src="app-assets/images/icon/pdf.png" alt="document" height="30" width="25" className="mr-1" />Registration.doc
                                                            </div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-indigo active">
                                                            <div className="timeline-time">2 Hrs</div>
                                                            <h6 className="timeline-title">Tina is attending your activity</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content">
                                                                <img src="app-assets/images/icon/pdf.png" alt="document" height="30" width="25" className="mr-1" />Activity.doc
                                                            </div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-orange">
                                                            <div className="timeline-time">5 hrs</div>
                                                            <h6 className="timeline-title">Josh is now following you</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content red-text">Pending</div>
                                                        </li>
                                                    </ul>
                                                    <p className="mt-5 mb-0 ml-5 font-weight-900">APPLICATIONS LOGS</p>
                                                    <ul className="widget-timeline mb-0">
                                                        <li className="timeline-items timeline-icon-green active">
                                                            <div className="timeline-time">Just now</div>
                                                            <h6 className="timeline-title">New order received urgent</h6>
                                                            <p className="timeline-text">Melissa liked your activity.</p>
                                                            <div className="timeline-content orange-text">Important</div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-cyan active">
                                                            <div className="timeline-time">05 min</div>
                                                            <h6 className="timeline-title">System shutdown.</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content blue-text">Urgent</div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-red">
                                                            <div className="timeline-time">20 mins</div>
                                                            <h6 className="timeline-title">Database overloaded 89%</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content">
                                                                <img src="app-assets/images/icon/pdf.png" alt="document" height="30" width="25" className="mr-1" />Database-log.doc
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <p className="mt-5 mb-0 ml-5 font-weight-900">SERVER LOGS</p>
                                                    <ul className="widget-timeline mb-0">
                                                        <li className="timeline-items timeline-icon-green active">
                                                            <div className="timeline-time">10 min</div>
                                                            <h6 className="timeline-title">System error</h6>
                                                            <p className="timeline-text">Melissa liked your activity.</p>
                                                            <div className="timeline-content red-text">Error</div>
                                                        </li>
                                                        <li className="timeline-items timeline-icon-cyan">
                                                            <div className="timeline-time">1 min</div>
                                                            <h6 className="timeline-title">Production server down.</h6>
                                                            <p className="timeline-text">Here are some news feed interactions concepts.</p>
                                                            <div className="timeline-content blue-text">Urgent</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <ul id="slide-out-chat" className="sidenav slide-out-right-sidenav-chat">
                                    <li className="center-align pt-2 pb-2 sidenav-close chat-head">
                                        <a href="#!"><i className="material-icons mr-0">chevron_left</i>Elizabeth Elliott</a>
                                    </li>
                                    <li className="chat-body">
                                        <ul className="collection">
                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">hello!</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">How can we help? We're here for you!</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">I am looking for the best admin template.?</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">Materialize admin is the responsive materializecss admin template.</p>
                                                </div>
                                            </li>

                                            <li className="collection-item display-grid width-100 center-align">
                                                <p>8:20 a.m.</p>
                                            </li>

                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">Ohh! very nice</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">Thank you.</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">How can I purchase it?</p>
                                                </div>
                                            </li>

                                            <li className="collection-item display-grid width-100 center-align">
                                                <p>9:00 a.m.</p>
                                            </li>

                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">From ThemeForest.</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">Only $24</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">Ohh! Thank you.</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar pl-5 pb-0" data-target="slide-out-chat">
                                                <span className="avatar-status avatar-online avatar-50"><img src="app-assets/images/avatar/avatar-7.png" alt="avatar" />
                                                </span>
                                                <div className="user-content speech-bubble">
                                                    <p className="medium-small">I will purchase it for sure.</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">Great, Feel free to get in touch on</p>
                                                </div>
                                            </li>
                                            <li className="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat">
                                                <div className="user-content speech-bubble-right">
                                                    <p className="medium-small">https://pixinvent.ticksy.com/</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="center-align chat-footer">
                                        <form className="col s12" onsubmit="slideOutChat()" action="javascript:void(0);">
                                            <div className="input-field">
                                                <input id="icon_prefix" type="text" className="search" />
                                                <label for="icon_prefix">Type here..</label>
                                                <a onclick="slideOutChat()"><i className="material-icons prefix">send</i></a>
                                            </div>
                                        </form>
                                    </li>
                                </ul>
                            </aside>

                        </div>
                        <div className="content-overlay"></div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>


    )
}
export default Cadreur;