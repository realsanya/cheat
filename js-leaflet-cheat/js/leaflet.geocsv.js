L.GeoCSV=L.GeoJSON.extend({
    options:{
        titles:["lat","lng","popup"],
        fieldSeparator:";",
        lineSeparator:"\n",
        deleteDobleQuotes:true,
        firstLineTitles:false},
        _propertiesNames:[],
        initialize:function(csv,options){
            L.Util.setOptions(this,options);
            L.GeoJSON.prototype.initialize.call(this,csv,options)},
            addData:function(data){
                if(typeof data==="string"){
                    var titulos=this.options.titles;if(this.options.firstLineTitles){
                        data=data.split(this.options.lineSeparator);
                        if(data.length<2) return;
                        titulos=data[0];
                        data.splice(0,1);
                        data=data.join(this.options.lineSeparator);
                        titulos=titulos.trim().split(this.options.fieldSeparator);
                        for(var i=0;i<titulos.length;i++){
                            titulos[i]=this._deleteDobleQuotes(titulos[i])
                        }
                        this.options.titles=titulos
                    }
                    for(var i=0;i<titulos.length;i++){
                        var prop=titulos[i].toLowerCase().replace(/[^\w ]+/g,"").replace(/ +/g,"_");
                        if (prop==""||prop=="_"||this._propertiesNames.indexOf(prop)>=0) prop="prop-"+i;
                        this._propertiesNames[i]=prop
                    }
                    data=this._csv2json(data)
                }
                L.GeoJSON.prototype.addData.call(this,data)
            },
            getPropertyName:function(title){
                var pos=this.options.titles.indexOf(title),prop="";
                if(pos>=0)prop=this._propertiesNames[pos];
                return prop
            },
            getPropertyTitle:function(prop){
                var pos=this._propertiesNames.indexOf(prop),title="";
                if(pos>=0)title=this.options.titles[pos];return title
            },
            _deleteDobleQuotes:function(cadena){
                if(this.options.deleteDobleQuotes)cadena=cadena.trim().replace(/^"/,"").replace(/"$/,"");return cadena
            },
            _csv2json:function(csv){
                var json={};json["type"]="FeatureCollection";json["features"]=[];
                var titulos=this.options.titles;csv=csv.split(this.options.lineSeparator);
                for(var num_linea=0;num_linea<csv.length;num_linea++){
                    var campos=csv[num_linea].trim().split(this.options.fieldSeparator),
                    lng=parseFloat(campos[titulos.indexOf("lng")]),
                    lat=parseFloat(campos[titulos.indexOf("lat")]);
                    if(campos.length==titulos.length&&lng<180&&lng>-180&&lat<90&&lat>-90){
                        var feature={};
                        feature["type"]="Feature";
                        feature["geometry"]={};
                        feature["properties"]={};
                        feature["geometry"]["type"]="Point";
                        feature["geometry"]["coordinates"]=[lng,lat];
                        for(var i=0;i<titulos.length;i++){
                            if(titulos[i]!="lat"&&titulos[i]!="lng"){
                                feature["properties"][this._propertiesNames[i]]=this._deleteDobleQuotes(campos[i])
                            }
                        }
                        json["features"].push(feature)}}return json
                    }
                });
            L.geoCsv=function(csv_string,options){return new L.GeoCSV(csv_string,options)
        };
