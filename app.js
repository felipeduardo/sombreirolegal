//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'SombreiroLegal': 'app'
});
//</debug>

Ext.application({

    name: 'SombreiroLegal',

    requires: [
        'Ext.TitleBar',
        'Ext.Video',
        'Ext.Map',
        'Ext.Button',
        'Ext.SegmentedButton',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.plugin.google.Traffic',
        'Ext.plugin.google.Tracker'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        /* The following is accomplished with the Google Map API */
        //var position = new google.maps.LatLng(37.44885, -122.158592),  //Sencha HQ

        infowindow = new google.maps.InfoWindow({
            content: 'Sencha HQ'
        }),

        /* Tracking Marker Image */
        image = new google.maps.MarkerImage(
            'resources/images/point.png',
            new google.maps.Size(32, 31),
            new google.maps.Point(0, 0),
            new google.maps.Point(16, 31)
        ),

        shadow = new google.maps.MarkerImage(
            'resources/images/shadow.png',
            new google.maps.Size(64, 52),
            new google.maps.Point(0, 0),
            new google.maps.Point(-5, 42)
        ),

        /* Buttons */
        trackingButton = Ext.create('Ext.Button', {
            iconMask: true,
            pressed: true,
            iconCls: 'locate'
        }),

        searchButton = Ext.create('Ext.Button', {
            iconMask: true,
            iconCls: 'search'
        }),

        toolbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            title: 'Sombreiro Legal',
            ui: 'light',
            defaults: {
                iconMask: true
            },
            items: [
                {
                    id: 'segmented',
                    xtype: 'segmentedbutton',
                    allowMultiple: true,
                    listeners: {
                        toggle: function(buttons, button, active) {
                            if (button == searchButton) {

                                mapdemo.getPlugins()[1].setHidden(!active);

                                /* TODO: search in API e MARK positions from API PLANTE AQUI */

                            } else if (button == trackingButton) {

                                var tracker = mapdemo.getPlugins()[0],
                                    marker = tracker.getMarker();
                                marker.setVisible(active);
                                if (active) {
                                    tracker.setTrackSuspended(false);
                                    Ext.defer(function() {
                                        tracker.getHost().on('centerchange', function() {
                                            marker.setVisible(false);
                                            tracker.setTrackSuspended(true);
                                            var segmented = Ext.getCmp('segmented'),
                                                pressedButtons = segmented.getPressedButtons(),
                                                trafficIndex = pressedButtons.indexOf(trafficButton),
                                                newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                                            segmented.setPressedButtons(newPressed);
                                        }, this, {single: true});
                                    }, 50, this);
                                }
                            }
                        }
                    },
                    items: [
                        trackingButton, searchButton
                    ]
                }
            ]
        });

        toolbarBottom = Ext.create('Ext.Toolbar', {
            docked: 'bottom',
            ui: 'dark',
            defaults: {
                iconMask: true
            },
            items: [
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    text: 'Tem Sombra Aqui!',
                    handler: function() {

                        /* TODO: send data to API Plante Aqui */
                        console.log('Aqui tem sombra...')

                    }
                }
            ]
        });

        var mapdemo = Ext.create('Ext.Map', {

            useCurrentLocation: false,

            mapOptions : {
                //center : new google.maps.LatLng(37.381592, -122.135672),  //nearby San Fran
                zoom : 15,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            },

            plugins : [
                new Ext.plugin.google.Tracker({
                    trackSuspended: false,   //suspend tracking initially
                    allowHighAccuracy: true,
                    marker: new google.maps.Marker({
                        title: 'Minha Localização Atual',
                        shadow: shadow,
                        icon: image
                    })
                }),
                new Ext.plugin.google.Traffic()
            ],

            listeners: {
                maprender: function(comp, map) {
                    var marker = new google.maps.Marker({
                        useCurrentLocation: false,
                        title : 'Minha Localização',
                        map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });

                    /*setTimeout(function() {
                        map.panTo(position);
                    }, 1000);*/
                }

            }
        });

        Ext.create('Ext.Panel', {
            fullscreen: true,
            layout: 'fit',
            items: [toolbar, mapdemo, toolbarBottom]
        });
    }
});
