<?php
$recipient_email = 'sales@ajyal.com.sa';
$site_name = 'AJYAL Website';

function wants_json() {
    return isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
}

function respond($ok, $message, $status = 200) {
    http_response_code($status);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('ok' => $ok, 'message' => $message));
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><html><head><meta charset="utf-8"><title>AJYAL Contact</title></head><body>';
        echo '<p>' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>';
        echo '<p><a href="index.html#contact">Return to AJYAL</a></p>';
        echo '</body></html>';
    }
    exit;
}

function field($name) {
    return trim(isset($_POST[$name]) ? (string) $_POST[$name] : '');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.', 405);
}

if (field('website') !== '') {
    respond(false, 'Unable to send request.', 400);
}

$route = field('route');
$first_name = field('first_name');
$last_name = field('last_name');
$organization = field('organization');
$role = field('role');
$email = field('email');
$phone = field('phone');
$message = field('message');

$allowed_routes = array('SolarCheck', 'Consultation', 'Presentation');
if (!in_array($route, $allowed_routes, true)) {
    $route = 'SolarCheck';
}

if ($first_name === '' || $last_name === '' || $organization === '' || $role === '' || $email === '' || $message === '') {
    respond(false, 'Please complete all required fields.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}

$safe = function ($value) {
    $value = preg_replace('/[\r\n]+/', ' ', $value);
    return trim($value);
};

$subject = 'AJYAL ' . $safe($route) . ' request from ' . $safe($first_name) . ' ' . $safe($last_name);
$body_lines = array(
    'New AJYAL website request',
    '',
    'Route: ' . $safe($route),
    'Name: ' . $safe($first_name) . ' ' . $safe($last_name),
    'Organization: ' . $safe($organization),
    'Role: ' . $safe($role),
    'Email: ' . $safe($email),
    'Phone: ' . $safe($phone),
    '',
    'Project details / message:',
    $message,
    '',
    'Source: ' . $site_name
);
$body = implode("\n", $body_lines);

$headers = array(
    'From: ' . $site_name . ' <no-reply@' . (isset($_SERVER['HTTP_HOST']) ? preg_replace('/[^A-Za-z0-9.-]/', '', $_SERVER['HTTP_HOST']) : 'ajyal.com.sa') . '>',
    'Reply-To: ' . $safe($first_name) . ' ' . $safe($last_name) . ' <' . $safe($email) . '>',
    'Content-Type: text/plain; charset=UTF-8'
);

$sent = mail($recipient_email, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond(false, 'Unable to send request. Please email sales@ajyal.com.sa directly.', 500);
}

respond(true, 'Request received. The right AJYAL specialist will be in touch within one business day.');
?>
