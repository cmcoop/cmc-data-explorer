//address
var usStates = [
                {
                    "name": "",
                    "value": null
                },
                {
                    "name": "Alabama",
                    "value": "AL"
                },
                {
                    "name": "Alaska",
                    "value": "AK"
                },
                {
                    "name": "American Samoa",
                    "value": "AS"
                },
                {
                    "name": "Arizona",
                    "value": "AZ"
                },
                {
                    "name": "Arkansas",
                    "value": "AR"
                },
                {
                    "name": "California",
                    "value": "CA"
                },
                {
                    "name": "Colorado",
                    "value": "CO"
                },
                {
                    "name": "Connecticut",
                    "value": "CT"
                },
                {
                    "name": "Delaware",
                    "value": "DE"
                },
                {
                    "name": "District Of Columbia",
                    "value": "DC"
                },
                {
                    "name": "Federated States Of Micronesia",
                    "value": "FM"
                },
                {
                    "name": "Florida",
                    "value": "FL"
                },
                {
                    "name": "Georgia",
                    "value": "GA"
                },
                {
                    "name": "Guam",
                    "value": "GU"
                },
                {
                    "name": "Hawaii",
                    "value": "HI"
                },
                {
                    "name": "Idaho",
                    "value": "ID"
                },
                {
                    "name": "Illinois",
                    "value": "IL"
                },
                {
                    "name": "Indiana",
                    "value": "IN"
                },
                {
                    "name": "Iowa",
                    "value": "IA"
                },
                {
                    "name": "Kansas",
                    "value": "KS"
                },
                {
                    "name": "Kentucky",
                    "value": "KY"
                },
                {
                    "name": "Louisiana",
                    "value": "LA"
                },
                {
                    "name": "Maine",
                    "value": "ME"
                },
                {
                    "name": "Marshall Islands",
                    "value": "MH"
                },
                {
                    "name": "Maryland",
                    "value": "MD"
                },
                {
                    "name": "Massachusetts",
                    "value": "MA"
                },
                {
                    "name": "Michigan",
                    "value": "MI"
                },
                {
                    "name": "Minnesota",
                    "value": "MN"
                },
                {
                    "name": "Mississippi",
                    "value": "MS"
                },
                {
                    "name": "Missouri",
                    "value": "MO"
                },
                {
                    "name": "Montana",
                    "value": "MT"
                },
                {
                    "name": "Nebraska",
                    "value": "NE"
                },
                {
                    "name": "Nevada",
                    "value": "NV"
                },
                {
                    "name": "New Hampshire",
                    "value": "NH"
                },
                {
                    "name": "New Jersey",
                    "value": "NJ"
                },
                {
                    "name": "New Mexico",
                    "value": "NM"
                },
                {
                    "name": "New York",
                    "value": "NY"
                },
                {
                    "name": "North Carolina",
                    "value": "NC"
                },
                {
                    "name": "North Dakota",
                    "value": "ND"
                },
                {
                    "name": "Northern Mariana Islands",
                    "value": "MP"
                },
                {
                    "name": "Ohio",
                    "value": "OH"
                },
                {
                    "name": "Oklahoma",
                    "value": "OK"
                },
                {
                    "name": "Oregon",
                    "value": "OR"
                },
                {
                    "name": "Palau",
                    "value": "PW"
                },
                {
                    "name": "Pennsylvania",
                    "value": "PA"
                },
                {
                    "name": "Puerto Rico",
                    "value": "PR"
                },
                {
                    "name": "Rhode Island",
                    "value": "RI"
                },
                {
                    "name": "South Carolina",
                    "value": "SC"
                },
                {
                    "name": "South Dakota",
                    "value": "SD"
                },
                {
                    "name": "Tennessee",
                    "value": "TN"
                },
                {
                    "name": "Texas",
                    "value": "TX"
                },
                {
                    "name": "Utah",
                    "value": "UT"
                },
                {
                    "name": "Vermont",
                    "value": "VT"
                },
                {
                    "name": "Virgin Islands",
                    "value": "VI"
                },
                {
                    "name": "Virginia",
                    "value": "VA"
                },
                {
                    "name": "Washington",
                    "value": "WA"
                },
                {
                    "name": "West Virginia",
                    "value": "WV"
                },
                {
                    "name": "Wisconsin",
                    "value": "WI"
                },
                {
                    "name": "Wyoming",
                    "value": "WY"
                }
];

var sampleTypes = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Discrete",
        "value": "D"
    },
    {
        "name": "In Situ Measurement",
        "value": "ISM"
    }
];

var netTimes = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "20 seconds",
        "value": "20"
    },
    {
        "name": "21-89 seconds",
        "value": "21-89"
    },
    {
        "name": "90 seconds",
        "value": "90"
    }
];

var manageParametersDropdown = [
    {
        "name": "Filter Name",
        "value": ""
    },
    {
        "name": "Alkalinity",
        "value": "Alkalinity"
    },
    {
        "name": "Air Temperature",
        "value": "Air Temperature"
    },
    {
        "name": "Chlorophyll",
        "value": "Chlorophyll"
    },
    {
        "name": "Conductivity",
        "value": "Conductivity"
    },
    {
        "name": "Dissolved Oxygen",
        "value": "Dissolved Oxygen"
    },{
        "name": "Bacteria",
        "value": "Bacteria"
    }, {
        "name": "Nitrogen",
        "value": "Nitrogen"
    }, {
        "name": "Phosphorus",
        "value": "Phosphorus"
    }, {
        "name": "pH",
        "value": "pH"
    }, {
        "name": "Phaeophytin",
        "value": "Phaeophytin"
    }, {
        "name": "Salinity",
        "value": "Salinity"
    }, {
        "name": "Silicate",
        "value": "Silicate"
    }, {
        "name": "Total Depth",
        "value": "Total Depth"
    }, {
        "name": "Total Dissolved Solids",
        "value": "Total Dissolved Solids"
    }, {
        "name": "Total Suspended Solids",
        "value": "Total Suspended Solids"
    }, {
        "name": "Water Clarity",
        "value": "Water Clarity"
    }, {
        "name": "Water Temperature",
        "value": "Water Temperature"
    }
];

var allarmConstants = {
    'grp1Rare': 5,
    'grp1Common': 5.6,
    'grp1Dominant': 5.3,
    'grp2Rare': 3.2,
    'grp2Common': 3.4,
    'grp2Dominant': 3,
    'grp3Rare': 1.2,
    'grp3Common': 1.1,
    'grp3Dominant': 1,
    'lowerLimit': 20,
    'upperLimit': 40
}

var iwlRockyConstants = {
    'metric1Upper': .322,
    'metric1Lower': .161,
    'metric2Upper': .345,
    'metric2Lower': .197,
    'metric5Upper': .015,
    'metric5Lower': .003,
    'metric6Upper': .064,
    'metric6Lower': .032,
    'metric3Upper': .615,
    'metric3Lower': .467,
    'metric4Upper': .208,
    'metric4Lower': .054,
    'unacceptable': 7,
    'acceptable': 9,
    'upperScore': 2,
    'middleScore': 1,
    'lowerScore': 0
}

var iwlMuddyConstants = {
    'metric1Upper': .078,
    'metric1Lower': .0085,
    'metric2Upper': .005,
    'metric2Lower': 0,
    'metric3Upper': .85,
    'metric3Lower': .63,
    'metric4Upper': .7,
    'metric4Lower': .27,
    'unacceptable': 8,
    'acceptable': 14,
    'upperScore': 6,
    'middleScore': 3,
    'lowerScore': 0
}

var bottomTypes = [
    {
        "name": "Rocky",
        "value": "1"
    },
    {
        "name": "Muddy",
        "value": "2"
    }
];

var conditionSet = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "ACB",
        "value": "ACB"
    },
    {
        "name": "ALLARM",
        "value": "ALLARM"
    },
    {
        "name": "ALL",
        "value": "ALL"
    }
];

var benthicMethods = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Izaac Walton League",
        "value": "iwl"
    },
    {
        "name": "ALLARM",
        "value": "allarm"
    }
];

//parameters        
var tiers = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "1",
        "value": "1"
    },
    {
        "name": "2",
        "value": "2"
    },
    {
        "name": "3",
        "value": "3"
    },
    {
        "name": "p",
        "value": "p"
    },
    {
        "name": "p1",
        "value": "p1"
    },
    {
        "name": "p2",
        "value": "p2"
    }
];

var units = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "%FS",
        "value": "%FS"
    },
    {
        "name": "CFU",
        "value": "CFU"
    },
    {
        "name": "deg C",
        "value": "deg C"
    },
    {
        "name": "mg/L",
        "value": "mg/L"
    },
    {
        "name": "mS/cm",
        "value": "mS/cm"
    },
    {
        "name": "NTU",
        "value": "NTU"
    },
    {
        "name": "ppm",
        "value": "ppm"
    },
    {
        "name": "ppt",
        "value": "ppt"
    },    
    {
        "name": "SU",
        "value": "SU"
    },
    {
        "name": "ug/L",
        "value": "ug/L"
    },
    {
        "name": "M",
        "value": "M"
    },
    {
        "name": "mmHg",
        "value": "mmHg"
    },
    {
        "name": "bacteria per 100m",
        "value": "bacteria per 100m"
    },
    {
        "name": "ppb",
        "value": "ppb"
    },
    {
        "name": "pss",
        "value": "pss"
    },
    {
        "name": "hours",
        "value": "hours"
    },
    {
        "name": "% Sat",
        "value": "% Sat"
    },
    {
        "name": "uS/cm",
        "value": "uS/cm"
    },
    {
        "name": "pct",
        "value": "pct"
    },
    {
        "name": "FAU",
        "value": "FAU"
    },
    {
        "name": "MPN",
        "value": "MPN"
    },
    {
        "name": "cm",
        "value": "cm"
    }
];


var matrix = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Water",
        "value": "Water"
    },
    {
        "name": "Air",
        "value": "Air"
    }
];

var tidal = [
    {   "name": "Choose One",
        "value": null
    },
    {
        "name": "NonTidal",
        "value": false
    },
    {
        "name": "Tidal",
        "value": true
    }
];

var surfaceSampleDepths = [
   
    
    {
        "name": "0.3 m",
        "value": .3
    },
    {
        "name": "0.5 m",
        "value": .5
    },
     {
         "name": "1.0 m",
         "value": 1
     }
];

var inSituOrLab = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Field",
        "value": "Field"
    },
    {
        "name": "Field or Home",
        "value": "Field or Home"
    },
    {
        "name": "Home",
        "value": "Home"
    },    
    {
        "name": "Home or Lab",
        "value": "Home or Lab"
    },
    {
        "name": "Lab",
        "value": "Lab"
    },
];

var analyticalMethods = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Lab Analysis",
        "value": "Lab"
    },
    {
        "name": "Kit",
        "value": "Kit"
    },
    {
        "name": "Probe",
        "value": "Probe"
    }
    
];

var inspectionFrequency = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "Before each use",
        "value": "Before each use"
    },
    {
        "name": "Before each use / Annual",
        "value": "Before each use / Annual"
    }
];

var calibrationFrequency = [
    {
        "name": "Before Each Use",
        "value": "Before Each Use"
    },
    {
        "name": "Annually",
        "value": "Annually"
    },
    {
        "name": "N/A",
        "value": "N/A"
    }
];

var binary = [
    {
        "name": "",
        "value": null
    },
    {
        "name": "true",
        "value": true
    },
    {
        "name": "false",
        "value": false
    }
];

var binaryNoNull = [ 

    {
        "name": "false",
        "value": false
    },
    {
        "name": "true",
        "value": true
    }
    
];






          