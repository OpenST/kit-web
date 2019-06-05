class Web::DeveloperController < Web::BaseController

  layout "economy"

  before_action :check_if_device_is_supported
  before_action :set_page_meta_info

  before_action :redirect_to_login_if_login_cookie_not_present

  after_action :remove_browser_caching

  # Planner to perform economy setup step one
  #
  # * Author: Ankit
  # * Date: 03/01/2019
  # * Reviewed By: Kedar
  #
  def developer
    @response = CompanyApi::Request::Developer.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
    ).index()

    unless @response.success?
      return handle_temporary_redirects(@response)
    end

    @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)

  end

  # Kit verify device email
  #
  # NOTE: Verify device page works with logged in and logged out modes
  #
  # * Author: Ankit
  # * Date: 29/05/2019
  # * Reviewed By:
  #
  def verify_sda

    if params[:a_t].present?
      unless Util::CommonValidator.is_valid_token?(params[:a_t])
        render 'web/user/invalid_token'
        return
      end

      @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_secure_data_access(a_t: params[:a_t])

      puts "\n\n\n\n\n@response======#{@response.inspect}\n\n\n\n"

      if @response.success?
        if @response.go_to.present?
          handle_temporary_redirects(@response)
          return
        end
      elsif @response.http_code == GlobalConstant::ErrorCode.unauthorized_access
        redirect_to :login and return
      else
        render 'web/user/invalid_token'
        return
      end
    else
      @response = CompanyApi::Request::Access.new(
        CompanyApi::Response::Formatter::Token,
        request.cookies,
        {"User-Agent" => http_user_agent}
      ).verify_secure_data_access({})

      if @response.go_to.present? || !@response.success?
        return handle_temporary_redirects(@response)
      end

      @presenter_obj = ::WebPresenter::TokenPresenter.new(@response, params)
    end
  end

end
