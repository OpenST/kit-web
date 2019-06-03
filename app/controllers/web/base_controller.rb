class Web::BaseController < ApplicationController

  before_action :basic_auth
  before_action :is_user_logged_in
  before_action :is_dvt_cookie_present
  after_action  :delete_dvt_cookie

  include Util::ResultHelper

  private

  def is_user_logged_in
    @is_user_logged_in = cookies[GlobalConstant::Cookie.user_cookie_name.to_sym].present?
  end

  # is dvt cookie present
  #
  # This is used to display toast on device verification
  #
  # * Author: Ankit
  # * Date: 30/05/2019
  # * Reviewed By:
  #
  def is_dvt_cookie_present
    @is_dvt_cookie_present = cookies[GlobalConstant::Cookie.device_verification_toast_cookie_name.to_sym].present?
  end

  # Render error response pages
  #
  def render_error_response(service_response)
    # Clean critical data
    service_response.data = {}
    render_error_response_for(service_response)
  end

  # Check if we support a given browser & device combination
  # If not we redirect to a page with 302
  # 1. DO NOT SUPPORT ANY MOBILE OR TABLET DEVICE
  def check_if_device_is_supported

    if browser.tablet? || browser.mobile?
      redirect_to :unsupported_client, status: GlobalConstant::ErrorCode.temporary_redirect and return
    end

  end

  # basic auth
  #
  # * Author: Puneet
  # * Date: 03/03/2018
  # * Reviewed By:
  #
  def basic_auth

    return if Rails.env.development?

    return if Rails.env.production? && GlobalConstant::Base.is_public_launch_done?

    users = {
      GlobalConstant::BasicAuth.username => GlobalConstant::BasicAuth.password
    }

    authenticate_or_request_with_http_basic do |username, password|
      if users[username].present? && users[username] == password
        true
      else
        false
      end
    end

  end

  # Dont allow browser caching for all GET requests
  #
  # * Author: Puneet
  # * Date: 03/03/2017
  # * Reviewed By:
  #
  def remove_browser_caching
    return unless request.get?
    response.headers['Pragma'] = 'no-cache'
    response.headers['Cache-Control'] = 'no-store, no-cache, max-age=0, must-revalidate, post-check=0, pre-check=0'
    #response.headers['Vary'] = '*'
    response.headers['Expires'] = '-1'
    response.headers['Last-Modified'] = "#{Time.now.gmtime.strftime("%a, %d %b %Y %T GMT")}"
  end

  # Primary check if login cookie not present, then redirect to login page
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def redirect_to_login_if_login_cookie_not_present
    return if @is_user_logged_in
    redirect_to :login, status: GlobalConstant::ErrorCode.temporary_redirect and return
  end

  # Verify existing login
  #
  # * Author: Puneet
  # * Date: 02/02/2018
  # * Reviewed By:
  #
  def logout_if_login_cookie_present
    # If cookie is present, log out without bothering about the response.
    if @is_user_logged_in
      CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).logout({})
    end
  end

  # Delete dvt cookie
  #
  # * Author: Ankit
  # * Date: 30/05/2019
  # * Reviewed By:
  #
  def delete_dvt_cookie
    if @is_dvt_cookie_present && action_name != "verify_device"
      delete_cookie(GlobalConstant::Cookie.device_verification_toast_cookie_name.to_sym)
    end
  end

end