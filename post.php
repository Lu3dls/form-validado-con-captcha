<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    $nombre=$_POST["nombre"];
    $correo=$_POST["correo"];
    $asunto=$_POST['asunto'];
    $mensaje=$_POST["mensaje"];
    $token=$_POST["token"];

 // desde aca va el recaptacha
    include('claves.php');
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $peticion = "$url?secret=$claves[privada]&response=$token";
    
    $rta_token=file_get_contents($peticion);
    $json_token = json_decode($rta_token, true); 
    $ok = $json_token['success'];// true si salio ok y false si algo salio mal
    if($ok === false){
        echo json_encode('error-token');
        //header('Location: contacto.html?error= error en el captcha');
        header('Locationhttps://www.davidserrano.com.ar/pruebas2/contacto?error= error en el captcha');
        die( );

    }else{
        echo json_encode('pasa-token');

    }
    if($json_token < 0.7){ // un scord muy bajo significa robot
        echo json_encode('error-token');
       // header('Location: contacto.html?error= No, señor robot usted no puede entrar');
        header('Locationhttps://www.davidserrano.com.ar/pruebas2/contacto?error= No, señor robot usted no puede entrar');
        die( );
    }else{
        echo json_encode('pasa nomas no sos robot');

    }

    var_dump($json_token);

    if($nombre === '' || $correo === '' || $asunto === '' || $mensaje === ''){
        echo json_encode('error');
    }else{
        echo json_encode('pasa-form');
        
        $body = <<<HTML
        <h1>Contacto desde la web</h1>
        <p>De: $nombre / $correo</p>
        <h2>Mensaje</h2>
        $mensaje
        HTML;

        require 'PHPMailer/Exception.php';
        require 'PHPMailer/PHPMailer.php';
        require 'PHPMailer/SMTP.php';
    
        require __DIR__.'/vendor/autoload.php';
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
        
        $mail = new PHPMailer(true);
    
        try {
            $mail->SMTPDebug = 0;                      
            $mail->isSMTP();                                            
            $mail->Host       = $_ENV['HOST'];                    
            $mail->SMTPAuth   = true;                                  
            $mail->Username   = 'webmaster@davidserrano.com.ar';                    
            $mail->Password   = $_ENV['PASSWORD'];                               
            $mail->SMTPSecure = 'ssl';           
            $mail->Port       = 465;      
    
            $mail->setFrom($correo, $nombre);
            $mail->addAddress('webmaster@davidserrano.com.ar', 'David L. Serrano');    
    
            $mail->isHTML(true);                                  
            $mail->Subject = $asunto;
            $mail->Body    = $body;
            $mail->CharSet = 'UTF-8';
    
            $mail->send();
    
            header('Location: https://www.davidserrano.com.ar/pruebas2/contacto.html');
            
            
        
        } catch (Exception $e) {
            echo "hubo un error al enviar el mensaje: {$mail->ErrorInfo}";
        }

    }


        /* esto e para cuando este validado correctamete para phpMailer en caso de que se use un select
        if($_REQUEST['op-select'] == 'consulta'){
            $asunto='consulta';
        }elseif($_REQUEST['op-select'] == 'reclamo'){
            $asunto='reclamo';
        }elseif($_REQUEST['op-select'] == 'otros'){
            $asunto='otros';
        }*/
    
    
?>