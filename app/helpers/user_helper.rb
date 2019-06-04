module UserHelper

  # check if cookie consent banner is to be shown
  def show_cookie_consent_banner?
    ['reset_password', 'login', 'sign_up'].include?(params[:action])
  end

end