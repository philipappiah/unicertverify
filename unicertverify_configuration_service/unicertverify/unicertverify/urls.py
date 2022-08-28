"""unicertverify URL Configuration
"""
from django.contrib import admin
from django.urls import path
from django.urls import re_path
from unicertverify.views import IssuerListView, IssuerDetailView, ProofRequestListByIssuer, ProofRequestListView, ProofRequestDetailView, TrusteeListView, TrusteeDetailView, CertificateListView, CertificateDetailView,CertificateDetailViewByApplicant,  ApplicantListView, ApplicantDetailView, ViewRequestDetailView, ViewRequestListView,ProofRequestListByApplicant

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/issuers/', IssuerListView.as_view(), name='issuer_list'),
    path('api/v1/issuer/<str:pk>/', IssuerDetailView.as_view(), name='issuer_detail'),
    path('api/v1/trustees/', TrusteeListView.as_view(), name='trustee_list'),
    re_path(r'^api/v1/issuer/trustee/$', TrusteeDetailView.as_view(), name='trustee_detail'),
    path('api/v1/certificates/', CertificateListView.as_view(), name='certificate_list'),
    path('api/v1/certificate/<str:pk>/', CertificateDetailView.as_view(), name='certificate_detail'),
    re_path(r'^api/v1/certificates/applicant/$', CertificateDetailViewByApplicant.as_view(), name='certificate_detail_by_applicant'),
    path('api/v1/applicants/', ApplicantListView.as_view(), name='applicant_list'),
    path('api/v1/applicant/<str:pk>', ApplicantDetailView.as_view(), name='applicant_detail'),
    path('api/v1/proof_requests/', ProofRequestListView.as_view(), name='view_request_list'),
    path('api/v1/proof_request/<str:pk>/', ProofRequestDetailView.as_view(), name='view_request_detail'),
    re_path(r'^api/v1/proof_requests/applicant/$', ProofRequestListByApplicant.as_view(), name='proof_request_by_applicant'),
    re_path(r'^api/v1/proof_requests/issuer/$', ProofRequestListByIssuer.as_view(), name='proof_request_by_issuer'),
    path('api/v1/view_requests/', ViewRequestListView.as_view(), name='view_request_list'),
    path('api/v1/view_request/<int:pk>/', ViewRequestDetailView.as_view(), name='view_request_detail')
]
