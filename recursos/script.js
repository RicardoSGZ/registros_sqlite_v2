//OPCIÓN DE CREAR NUEVA TABLA
function conversor(str){
    var arr = str.split("");
    for (var i = 0; i < arr.length; i++){
        if(arr[i] == "á"){
            arr[i] = "a";
        } else if (arr[i] == "é"){
            arr[i] = "e";
        } else if (arr[i] == "í"){
            arr[i] = "i";
        } else if (arr[i] == "ó"){
            arr[i] = "o";
        } else if (arr[i] == "ú"){
            arr[i] = "u";
        } else if (arr[i] == "ñ"){
            arr[i] = "n";
        } else if (arr[i] == " "){
            arr[i] = "_";
        }
    }
    var str2 = arr.join("").toLowerCase();
    return str2;
}
document.getElementById("btn_createtable").addEventListener("click", function () {
    document.getElementById('intro').innerHTML = '';
    var div_cr = document.createElement('div');
    div_cr.setAttribute('id', 'cat_crea');
    for (var i = 0; i < 10; i++){
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', i);
        input.setAttribute('class', 'cr_field');
        input.setAttribute('placeholder', 'Nombre de la categoría');
        div_cr.appendChild(input);
        document.getElementById('intro').appendChild(div_cr);
    }
    var div_selecc = document.createElement('div');
    div_selecc.setAttribute('id', 'tipos_crea');
    for (var i = 0; i < 10; i++){
        var selecc = document.createElement('select');
        selecc.setAttribute("id", i + "_tipo");
        var opcion1 = document.createElement('option');
        opcion1.innerHTML='Texto';
        var opcion2 = document.createElement('option');
        opcion2.innerHTML='Número';
        selecc.appendChild(opcion1);
        selecc.appendChild(opcion2);
        div_selecc.appendChild(selecc);
        document.getElementById('intro').appendChild(div_selecc);
    }
    var btn_crea = document.createElement('button');
    btn_crea.setAttribute('id', 'btn_createtable2');
    btn_crea.innerHTML = 'CREAR TABLA';
    document.getElementById('intro').appendChild(btn_crea);
    document.getElementById("btn_createtable2").addEventListener("click", function(){	
        var db = new SQL.Database();
        var cr_field = document.getElementsByClassName("cr_field");
        var crt_field = document.getElementsByTagName('select');
        var cat_conv;
        var cat_type_conv;
        var sql_crt_cats = "CREATE TABLE IF NOT EXISTS 'categorias' ('full_name' varchar(100), 'db_name' varchar(100))";
        db.run(sql_crt_cats);
        var sql_crt_cats_ins = "INSERT INTO categorias ('full_name', 'db_name') VALUES ('ID', 'id')";
        db.run(sql_crt_cats_ins);
        var sql_crt = "CREATE TABLE IF NOT EXISTS 'tabla'";
        sql_crt += " ('id' integer PRIMARY KEY, '" + cat_conv + "' " + cat_type_conv;
        for (var i = 0; i < cr_field.length; i++){
            if (cr_field[i].value != ""){
                cat_conv = conversor(cr_field[i].value);
                if(crt_field[i].value == "Número"){
                    cat_type_conv = "integer";
                }else if(crt_field[i].value == "Texto"){
                    cat_type_conv = "text";
                }
                sql_crt += ", '" + cat_conv + "' " + cat_type_conv;
                sql_crt_cats_ins = "INSERT INTO categorias ('full_name', 'db_name') VALUES ('" + cr_field[i].value + "', '" + cat_conv + "')";
                db.run(sql_crt_cats_ins);
            }
        }
        sql_crt_cats_ins = "INSERT INTO categorias ('full_name', 'db_name') VALUES ('Imagen principal', 'img_pr')";
        db.run(sql_crt_cats_ins);
        sql_crt_cats_ins = "INSERT INTO categorias ('full_name', 'db_name') VALUES ('Imagen 2', 'img_sc1')";
        db.run(sql_crt_cats_ins);
        sql_crt_cats_ins = "INSERT INTO categorias ('full_name', 'db_name') VALUES ('Imagen 3', 'img_sc2')";
        db.run(sql_crt_cats_ins);
        sql_crt += ", 'img_pr' varchar(100), 'img_sc1' varchar(100), 'img_sc2' varchar(100), 'img_sc3' varchar(100))";
        db.run(sql_crt);
        alert("Tabla creada");
        var binaryArray = db.export();
        var blob = new Blob([binaryArray], { type: "application/octet-stream" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.style.display = "none";
        link.setAttribute("id", "dld");
        link.setAttribute('download', "registros.db");
        document.getElementById("intro").after(link);
        link.click();
        window.URL.revokeObjectURL(url); 
    });
});
//FIN OPCIÓN DE CREAR NUEVA TABLA

//VARIABLES REGEX
var regex = new RegExp("[^A-Za-z0-9\\sáéíóúñ.]");
var regex_col_fecha = new RegExp("(fecha|dia)\w*");
var regex_col_hora = new RegExp("(hora)\w*");
//FIN VARIABLES REGEX

// MOSTRAR NUMERO REGISTROS
function numero() {
    var sql_t = "SELECT count(*) AS num FROM tabla";
    var stmt_t = db.prepare(sql_t);
    while (stmt_t.step()) {
        var row_t = stmt_t.getAsObject();
    }
    var n = document.getElementsByTagName("tr").length-1;
    document.getElementById("numero").innerHTML = "Número de registros seleccionados: " + n + 
    " (" + ((n / row_t["num"]) * 100).toFixed(2) + "%)";
    stmt_t.free();
}
//FIN MOSTRAR NUMERO REGISTROS

//FUNCION PRINCIPAL DE EJECUCIÓN SQL
function ejecucion_sentencia (sql){
    document.getElementById('tabla').innerHTML='';
    var sql_cat = "SELECT * FROM categorias";
    var ejec_cat = db.prepare(sql_cat);
    var tabla = document.createElement('table');
    var tabla_fila = document.createElement('tr');
    while(ejec_cat.step()){
        var fila_cat = ejec_cat.getAsObject();
        var tabla_cabecera = document.createElement('th');
        tabla_cabecera.setAttribute("onclick", "ordenar('" + fila_cat['db_name'] + "');");
        tabla_cabecera.innerHTML = fila_cat['full_name'];
        tabla_fila.appendChild(tabla_cabecera);
    }
    tabla.appendChild(tabla_fila);
    var ejec = db.prepare(sql);
    while (ejec.step()){
        var fila = ejec.getAsObject();
        tabla_fila = document.createElement('tr');
        var ejec_cat_2 = db.prepare(sql_cat);
        var n = 0;
        while(ejec_cat_2.step()){
            var fila_cat = ejec_cat_2.getAsObject();
            if(n == 0){
                var tabla_celda = document.createElement('td');
                tabla_celda.innerHTML = fila[fila_cat['db_name']] + "<div id='iconos'>" +
                "<img onclick='borrar(" + fila[fila_cat['db_name']] + ");' class='borrar' src='recursos/imagenes/del.png' alt='Borrar'/></div>";
                tabla_fila.appendChild(tabla_celda);
            }else{
                var tabla_celda = document.createElement('td');
                tabla_celda.setAttribute("onclick", "editar(" + fila['id'] + ");");
                var div_int_td = document.createElement('div');
                div_int_td.innerHTML = fila[fila_cat['db_name']];
                tabla_celda.appendChild(div_int_td);
                tabla_fila.appendChild(tabla_celda);
            }
            n++;
        }
        tabla.appendChild(tabla_fila);   
    }
    document.getElementById('tabla').appendChild(tabla);
    numero();
}
//FIN DE FUNCION PRINCIPAL DE EJECUCIÓN SQL

 //TABLA INICIAL
 function tabla_inicial(){
    var sql = "SELECT * ";
    sql += "FROM tabla";
    ejecucion_sentencia(sql);
}
//FIN TABLA INICIAL

//BÚSQUEDA
document.getElementById('busq').addEventListener('change', function(){
    var texto_busq = document.getElementById('busq').value;
    if (regex.test(texto_busq)) {
        alert("Carácter incorrecto");
    } else {
        var sql_busq = "SELECT * FROM tabla WHERE ";
        var sql_cat_5 = "SELECT * FROM categorias";
        var ejec_cat_5 = db.prepare(sql_cat_5);
        var j = 0;
        while(ejec_cat_5.step()){
            var fila_cat = ejec_cat_5.getAsObject();
            if(j == 0){
                sql_busq += fila_cat['db_name'] + " LIKE '%" + texto_busq + "%'";
            }else{
                sql_busq += " OR " + fila_cat['db_name'] + " LIKE '%" + texto_busq + "%'";
            }
            j++;
        }
        ejecucion_sentencia(sql_busq);
    }
});
//FIN BÚSQUEDA

//BORRAR REGISTRO
function borrar(id){
    var confirm_del = confirm("¿Quiere eliminar el registro nº "+ id +"?" );
    if(confirm_del == true){
        var sql_del = "DELETE FROM tabla WHERE id = " + id;
        var ejec_sql_del = db.run(sql_del);
        alert("Se ha eliminado el registro nº " + id + ".");
        var binaryArray = db.export();
        var blob = new Blob([binaryArray], { type: "application/octet-stream" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.style.display = "none";
        link.setAttribute("id", "dld");
        link.setAttribute('download', "registros.db");
        document.getElementById("tabla").after(link);
        link.click();
        window.URL.revokeObjectURL(url);
    } else {
        alert("No se ha eliminado el registro");
    }  
}
//FIN BORRAR REGISTRO

//MODIFICAR REGISTRO
function editar(id){
    location.assign('#up');
    document.getElementById('add_mod_section').innerHTML='';
    document.getElementById('tabla').style.display='none';
    document.getElementById('numero').style.display='none';
    document.getElementById('add_mod_section').style.display='block';
    var sql_cat_2 = "SELECT * FROM categorias WHERE db_name != 'id'";
    var ejec_cat_2 = db.prepare(sql_cat_2);
    var div_campos = document.createElement('div');
    div_campos.setAttribute('id', 'div_campos');
    var campo_id = document.createElement('p');
    campo_id.setAttribute('id', 'campo_id');
    div_campos.appendChild(campo_id);
    while (ejec_cat_2.step()) {
        var fila_cat = ejec_cat_2.getAsObject();
        if(fila_cat['db_name'] == 'added_collection' || 
        regex_col_fecha.test(fila_cat['db_name'])){
            var labelfecha = document.createElement("label");
            labelfecha.setAttribute('for', fila_cat['db_name']);
            labelfecha.innerHTML=fila_cat['full_name'];
            div_campos.appendChild(labelfecha);
            var campofecha = document.createElement("input");
            campofecha.setAttribute('type', 'date');
            campofecha.setAttribute('id', fila_cat['db_name']);
            campofecha.setAttribute('class', 'fecha');
            div_campos.appendChild(campofecha);
        }else if(regex_col_hora.test(fila_cat['db_name'])){
            var labelhora = document.createElement("label");
            labelhora.setAttribute('for', fila_cat['db_name']);
            labelhora.innerHTML=fila_cat['full_name'];
            div_campos.appendChild(labelhora);
            var campohora = document.createElement("input");
            campohora.setAttribute('type', 'time');
            campohora.setAttribute('id', fila_cat['db_name']);
            campohora.setAttribute('class', 'hora');
            div_campos.appendChild(campohora);
        }else{
            var label = document.createElement("label");
            label.setAttribute('for', fila_cat['db_name']);
            label.innerHTML=fila_cat['full_name'];
            div_campos.appendChild(label);
            var campo = document.createElement("textarea");
            campo.setAttribute('id', fila_cat['db_name']);
            campo.setAttribute("placeholder", fila_cat['full_name']);
            div_campos.appendChild(campo);
        }
    }
    var boton_add = document.createElement('button');
    boton_add.innerHTML = 'MODIFICAR';
    div_campos.appendChild(boton_add);
    document.getElementById("add_mod_section").appendChild(div_campos);
    var sql_mod = "SELECT * FROM tabla WHERE id = " + id;
    var ejec_sql_3 = db.prepare(sql_mod);
    var sql_cat_3 = "SELECT * FROM categorias where db_name != 'id'";
    var ejec_cat_3 = db.prepare(sql_cat_3);
    while (ejec_sql_3.step()) {
        var fila = ejec_sql_3.getAsObject();
        while(ejec_cat_3.step()){
            var fila_cat = ejec_cat_3.getAsObject();
            document.getElementById(fila_cat['db_name']).value = fila[fila_cat['db_name']];
            document.getElementById('campo_id').innerHTML = "ID: " + fila['id'];
            }    
        var div_imagenes = document.createElement('div');
        div_imagenes.setAttribute('id', 'div_imagenes');
        if(fila['img_pr'] != ''){
            var imagen_pr = document.createElement('img');
            var enlace_img = document.createElement('a');
            imagen_pr.setAttribute("src", fila['img_pr']);
            enlace_img.setAttribute('href', fila['img_pr']);
            enlace_img.setAttribute('target', '_blank');
            imagen_pr.setAttribute('id', 'img_principal');
            enlace_img.appendChild(imagen_pr);
            div_imagenes.appendChild(enlace_img);
        }
        if(fila['img_sc1'] != ''){
            var imagen_sc1 = document.createElement('img');
            var enlace_img_sc1 = document.createElement('a');
            imagen_sc1.setAttribute('src', fila['img_sc1']);
            enlace_img_sc1.setAttribute('href', fila['img_sc1']);
            enlace_img_sc1.setAttribute('target', '_blank');
            imagen_sc1.setAttribute('id', 'img_sc1');
            enlace_img_sc1.appendChild(imagen_sc1);
            div_imagenes.appendChild(enlace_img_sc1);
        }
        if(fila['img_sc2'] != ''){
            var imagen_sc2 = document.createElement('img');
            var enlace_img_sc2 = document.createElement('a');
            imagen_sc2.setAttribute('src', fila['img_sc2']);
            enlace_img_sc2.setAttribute('href', fila['img_sc2']);
            enlace_img_sc2.setAttribute('target', '_blank');
            imagen_sc2.setAttribute('id', 'img_sc2');
            enlace_img_sc2.appendChild(imagen_sc2);
            div_imagenes.appendChild(enlace_img_sc2);
        }
        if(fila['img_sc3'] != ''){
            var imagen_sc3 = document.createElement('img');
            var enlace_img_sc3 = document.createElement('a');
            imagen_sc3.setAttribute('src', fila['img_sc3']);
            enlace_img_sc3.setAttribute('href', fila['img_sc3']);
            enlace_img_sc3.setAttribute('target', '_blank');
            imagen_sc3.setAttribute('id', 'img_sc3');
            enlace_img_sc3.appendChild(imagen_sc3);
            div_imagenes.appendChild(enlace_img_sc3);
        }
        document.getElementById('add_mod_section').appendChild(div_imagenes);
    }
    document.getElementById('add_mod_section').getElementsByTagName('button')[0].addEventListener('click', function(){
        var campos_mod = document.getElementById("add_mod_section").getElementsByTagName("textarea");
        var confirm_mod = confirm("¿Quiere modificar el registro nº "+ id +"?" );
            if (confirm_mod == true) {
                var sql_mod = "UPDATE tabla SET ";
                var sql_cat_4 = "SELECT * FROM categorias where db_name != 'id'";
                var ejec_cat_4 = db.prepare(sql_cat_4);
                while(ejec_cat_4.step()){
                    var fila_cat = ejec_cat_4.getAsObject();
                    sql_mod += "'" + fila_cat['db_name'] + "'='" + 
                    document.getElementById(fila_cat['db_name']).value + "', ";
                }
                sql_mod = sql_mod.substr(0, sql_mod.length-2);
                sql_mod = sql_mod + " WHERE id=" + id;
                var ejec_sql_mod = db.run(sql_mod);
                alert("Se ha actualizado el registro nº " + id + ".");
                var binaryArray = db.export();
                var blob = new Blob([binaryArray], { type: "application/octet-stream" });
                var url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.style.display = "none";
                link.setAttribute("id", "dld");
                link.setAttribute('download', "registros.db");
                document.getElementById("add_mod_section").after(link);
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert("No se ha actualizado el registro");
            }
    });
}
//FIN MODIFICAR REGISTRO

//ORDENAR REGISTROS
    var a = 2;
    function ordenar(columna){
        var sql_ordena = "SELECT * ";
        sql_ordena += "FROM tabla";
        var texto_busq = document.getElementById('busq').value;
        if(texto_busq != ''){
            var sql_cat_5 = "SELECT * FROM categorias";
            var ejec_cat_5 = db.prepare(sql_cat_5);
            var j = 0;
            sql_ordena += " WHERE ";
            while(ejec_cat_5.step()){
                var fila_cat = ejec_cat_5.getAsObject();
                if(j == 0){
                    sql_ordena += fila_cat['db_name'] + " LIKE '%" + texto_busq + "%'";
                }else{
                    sql_ordena += " OR " + fila_cat['db_name'] + " LIKE '%" + texto_busq + "%'";
                }
                j++;
            }
        }
        sql_ordena += " ORDER BY " + columna;
        if(a%2 != 0){
            sql_ordena += " DESC";
        }
        ejecucion_sentencia(sql_ordena);
        a++; 
    }
//FIN ORDENAR REGISTROS

//CONEXIÓN CON LA BASE DE DATOS
var archivo_sel = document.getElementById('archivo');
archivo_sel.addEventListener('change', function(){
    document.body.style.backgroundColor='white';
    document.getElementById('intro').style.display = 'none';
    document.getElementById('div_add').style.display = 'block';
    document.getElementById('btn_search').style.display = 'block';
    document.getElementById('div_refresh').style.display = 'block';
    document.getElementById('tabla').innerHTML='';
    var f = archivo_sel.files[0];
    var r = new FileReader();
    r.onload = function(){
        var Uints = new Uint8Array(r.result);
        db = new SQL.Database(Uints);
        tabla_inicial();

        //VOLVER A INICIO
        document.getElementsByTagName('header')[0].addEventListener('click', function(){
            document.getElementById('add_mod_section').innerHTML='';
            document.getElementById('tabla').style.display='block';
            document.getElementById('numero').style.display='block';
            document.getElementById('add_mod_section').style.display='none';
        });
        //FIN VOLVER A INICIO

        //ACTUALIZAR TABLA
        document.getElementById('div_refresh').addEventListener('click', function(){
            if(document.getElementById('add_mod_section').style.display=='block'){
                document.getElementById('add_mod_section').innerHTML='';
                document.getElementById('tabla').style.display='block';
                document.getElementById('numero').style.display='block';
                document.getElementById('add_mod_section').style.display='none';
            }
            document.getElementById('busq').value='';
            tabla_inicial();
        });
        //FIN ACTUALIZAR TABLA

        //AÑADIR REGISTRO
        document.getElementById('div_add').addEventListener('click', function(){
            location.assign('#up');
            document.getElementById('add_mod_section').innerHTML='';
            document.getElementById('tabla').style.display='none';
            document.getElementById('numero').style.display='none';
            document.getElementById('add_mod_section').style.display='block';
            var sql_cat_2 = "SELECT * FROM categorias WHERE db_name != 'id'";
            var ejec_cat_2 = db.prepare(sql_cat_2);
            while (ejec_cat_2.step()) {
                var fila_cat = ejec_cat_2.getAsObject();
                if(fila_cat['db_name'] == 'added_collection' || 
                regex_col_fecha.test(fila_cat['db_name'])){
                    var labelfecha = document.createElement("label");
                    labelfecha.setAttribute('for', fila_cat['db_name']);
                    labelfecha.innerHTML=fila_cat['full_name'];
                    document.getElementById("add_mod_section").appendChild(labelfecha);
                    var campofecha = document.createElement("input");
                    campofecha.setAttribute('type', 'date');
                    campofecha.setAttribute('id', fila_cat['db_name']);
                    campofecha.setAttribute('class', 'fecha');
                    document.getElementById("add_mod_section").appendChild(campofecha);
                }else if(regex_col_hora.test(fila_cat['db_name'])){
                    var labelhora = document.createElement("label");
                    labelhora.setAttribute('for', fila_cat['db_name']);
                    labelhora.innerHTML=fila_cat['full_name'];
                    document.getElementById("add_mod_section").appendChild(labelhora);
                    var campohora = document.createElement("input");
                    campohora.setAttribute('type', 'time');
                    campohora.setAttribute('id', fila_cat['db_name']);
                    campohora.setAttribute('class', 'hora');
                    document.getElementById("add_mod_section").appendChild(campohora);
                }else{
                    var label = document.createElement("label");
                    label.setAttribute('for', fila_cat['db_name']);
                    label.innerHTML=fila_cat['full_name'];
                    document.getElementById("add_mod_section").appendChild(label);
                    var campo = document.createElement("textarea");
                    campo.setAttribute("placeholder", fila_cat['full_name']);
                    campo.setAttribute('id', fila_cat['db_name']);
                    document.getElementById("add_mod_section").appendChild(campo);
                }
            }
            var boton_add = document.createElement('button');
            boton_add.innerHTML = 'AÑADIR';
            document.getElementById("add_mod_section").appendChild(boton_add);

            var add_boton = document.getElementById("add_mod_section").getElementsByTagName('button')[0];
				add_boton.addEventListener("click", function () {
					var confirm_add = confirm("¿Quiere añadir el registro?" );
						if (confirm_add == true) {
							var sql_add = "INSERT INTO tabla (";
                            var sql_cat_4 = "SELECT * FROM categorias where db_name != 'id'";
							var ejec_cat_4 = db.prepare(sql_cat_4);
							while(ejec_cat_4.step()){
                                var fila_cat = ejec_cat_4.getAsObject();
                                sql_add += "'" + fila_cat['db_name'] + "', ";
                            }
                            sql_add = sql_add.substr(0, sql_add.length-2);
                            sql_add += ") VALUES (";
                            var sql_cat_4 = "SELECT * FROM categorias where db_name != 'id'";
							var ejec_cat_4 = db.prepare(sql_cat_4);
							while(ejec_cat_4.step()){
                                var fila_cat = ejec_cat_4.getAsObject();
                                sql_add += "'" + document.getElementById(fila_cat['db_name']).value + "', ";
                            }
                            sql_add = sql_add.substr(0, sql_add.length-2);
                            sql_add += ")";
							console.log(sql_add);	
							var ejec_sql_add = db.run(sql_add);
							alert("Se ha añadido el registro");
							var binaryArray = db.export();
							var blob = new Blob([binaryArray], { type: "application/octet-stream" });
							var url = window.URL.createObjectURL(blob);
							var link = document.createElement('a');
							link.href = url;
							link.style.display = "none";
							link.setAttribute("id", "dld");
							link.setAttribute('download', "registros.db");
							document.getElementById("add_mod_section").after(link);
							link.click();
							window.URL.revokeObjectURL(url);
						} else {
							alert("No se ha añadido el registro");
						}
				});
        });
        // FIN AÑADIR REGISTRO  
    }
    r.readAsArrayBuffer(f);
});