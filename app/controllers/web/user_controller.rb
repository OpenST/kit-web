class Web::UserController < Web::BaseController

  layout "user"

  before_action :check_if_device_is_supported, except: [:verify_device]
  before_action :set_page_meta_info

  before_action :logout_if_login_cookie_present, only: [
    :sign_up,
    :login,
    :logout,
    :reset_password,
    :update_password
  ]

  before_action :redirect_to_login_if_login_cookie_not_present, only: [
    :mfa
  ]

  after_action :remove_browser_caching

  # Kit Signup page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def sign_up

    if params[:i_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:i_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Access.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).get_sign_up_page_details({i_t: params[:i_t]})

      unless @response.success?
        if @response.error_data.present?
          render 'web/user/invalid_token'
        else
          render_error_response(@response)
        end
        return
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

      render "sign_up_via_invite", :locals => {:invite_token => params[:i_t]}

    else

      render "sign_up_without_invite"

    end

  end

  # Kit MFA Page
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def mfa

    @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).get_setup_mfa_details({})

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    render 'mfa'

  end

  # Kit Login
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def login
  end

  # Kit Logout
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def logout
    redirect_to :login
  end

  # Kit Reset Password Request
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def reset_password
  end

  # Kit Update password
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def update_password
    unless Util::CommonValidator.is_valid_token?(params[:r_t])
      render 'web/user/invalid_token'
      return
    end
  end

  # Kit verify double optin email
  #
  # NOTE: Verify Email page works with logged in and logged out modes
  #
  # * Author: Puneet
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def verify_email

    if params[:r_t].present?

      unless Util::CommonValidator.is_valid_token?(params[:r_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_email(r_t: params[:r_t])

      if @response.success?
        if @response.go_to.present?
          handle_temporary_redirects(@response)
          return
        else
          render 'web/user/verify_email_success' and return
        end
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        render 'web/user/invalid_token'
        return
      end
      
    else
     
      @response = CompanyApi::Request::Access.new(
          CompanyApi::Response::Formatter::Manager,
          request.cookies,
          {"User-Agent" => http_user_agent}
      ).verify_email({})

      if @response.go_to.present? || !@response.success?
        return handle_temporary_redirects(@response)
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)

    end
    
  end

  # Kit verify device email
  #
  # NOTE: Verify device page works with logged in and logged out modes
  #
  # * Author: Ankit
  # * Date: 29/05/2019
  # * Reviewed By:
  #
  def verify_device

    if params[:d_t].present?
      unless Util::CommonValidator.is_valid_token?(params[:d_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_device(d_t: params[:d_t])

      if @response.success?
        if @response.go_to.present?
          handle_temporary_redirects(@response)
          return
        else
          render 'web/user/verify_device_success' and return
        end
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        render 'web/user/invalid_token'
        return
      end
    else
      @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Manager,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_device({})

      if @response.go_to.present? || !@response.success?
        return handle_temporary_redirects(@response)
      end

      @presenter_obj = ::WebPresenter::ManagerPresenter.new(@response, params)
    end
  end

  
  
end
